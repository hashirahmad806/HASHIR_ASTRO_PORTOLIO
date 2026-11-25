"""Real-time LangChain + LangGraph RAG Chatbot with Groq LLM and Direct WhatsApp Handoff."""

from __future__ import annotations

import os
import time
from pathlib import Path
from typing import Annotated, Any, Dict, List, Literal, Optional, TypedDict
from urllib.parse import quote

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages

from .github_service import fetch_github_activity
from .rag_store import get_rag_index

# Ensure backend/.env is loaded regardless of current working directory
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

WHATSAPP_NUMBER = os.getenv("WHATSAPP_NUMBER", "923294222404").strip() or "923294222404"

RouteIntent = Literal["rag_query", "rag_plus_github", "whatsapp_direct"]


class RagChatState(TypedDict):
    """Typed LangGraph conversation state."""

    messages: Annotated[List[BaseMessage], add_messages]
    query: str
    intent: RouteIntent
    retrieved_chunks: List[Dict[str, Any]]
    github_context: Optional[Dict[str, Any]]
    answer: str
    sources: List[str]
    suggested_followups: List[str]
    model: str
    mode: str
    embedding_backend: str
    needs_whatsapp: bool
    whatsapp_url: str
    llm_error: Optional[str]
    trace: List[Dict[str, Any]]


def build_whatsapp_forward_url(
    user_query: str,
    visitor_name: str = "",
    note: str = "",
) -> str:
    """Create a wa.me deep link forwarding the visitor's exact question/message directly to Hashir."""
    lines = ["Hi Hashir, I'm reaching out from your portfolio."]
    if visitor_name.strip():
        lines.append(f"Name: {visitor_name.strip()}")
    if user_query.strip():
        lines.append(f"Question / Inquiry: {user_query.strip()}")
    if note.strip():
        lines.append(f"Note: {note.strip()}")
    text = "\n".join(lines)
    return f"https://wa.me/{WHATSAPP_NUMBER}?text={quote(text)}"


def get_active_llm():
    """Initialize real ChatGroq / ChatOpenAI / ChatGoogleGenerativeAI model from environment."""
    load_dotenv(Path(__file__).resolve().parents[1] / ".env")

    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    if groq_key:
        from langchain_groq import ChatGroq

        model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b").strip()
        return (
            ChatGroq(model=model_name, temperature=0.25, api_key=groq_key, max_tokens=700),
            model_name,
            "groq-rag-live",
        )

    openai_key = os.getenv("OPENAI_API_KEY", "").strip()
    if openai_key:
        from langchain_openai import ChatOpenAI

        model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip()
        return (
            ChatOpenAI(model=model_name, temperature=0.25, api_key=openai_key),
            model_name,
            "openai-rag-live",
        )

    google_key = os.getenv("GOOGLE_API_KEY", "").strip()
    if google_key:
        from langchain_google_genai import ChatGoogleGenerativeAI

        model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
        return (
            ChatGoogleGenerativeAI(model=model_name, temperature=0.25, google_api_key=google_key),
            model_name,
            "gemini-rag-live",
        )

    return None, "unconfigured", "missing-llm-key"


def analyze_query_node(state: RagChatState) -> Dict[str, Any]:
    """Classify visitor query into direct WhatsApp handoff, live GitHub RAG, or standard RAG."""
    t0 = time.perf_counter()
    q = state["query"].lower()

    whatsapp_triggers = (
        "whatsapp",
        "forward my message",
        "talk to hashir",
        "talk to a human",
        "speak with hashir",
        "speak directly",
        "send message directly",
        "connect me to hashir",
    )
    github_triggers = ("github", "commit", "streak", "contributions", "heatmap", "repositories", "repos")

    if any(t in q for t in whatsapp_triggers):
        intent: RouteIntent = "whatsapp_direct"
    elif any(t in q for t in github_triggers):
        intent = "rag_plus_github"
    else:
        intent = "rag_query"

    elapsed = round((time.perf_counter() - t0) * 1000, 2)
    trace = list(state.get("trace", []))
    trace.append({"node": "analyze_query", "intent": intent, "durationMs": elapsed})
    return {"intent": intent, "trace": trace}


async def retrieve_rag_context_node(state: RagChatState) -> Dict[str, Any]:
    """Execute cosine similarity vector retrieval over portfolio, CV PDF, and GitHub chunks."""
    t0 = time.perf_counter()
    rag = get_rag_index()
    results = rag.similarity_search(state["query"], k=6)

    chunks = [
        {
            "source": doc.metadata.get("source", "Portfolio"),
            "category": doc.metadata.get("category", "general"),
            "score": round(float(score), 4),
            "excerpt": doc.page_content[:260] + ("..." if len(doc.page_content) > 260 else ""),
            "content": doc.page_content,
        }
        for doc, score in results
    ]

    github_ctx: Optional[Dict[str, Any]] = None
    if state["intent"] == "rag_plus_github":
        github_ctx = await fetch_github_activity(force_refresh=False)

    sources = list(dict.fromkeys(c["source"] for c in chunks))
    if github_ctx is not None:
        sources.append("GitHub Live REST & Contributions Feed")

    elapsed = round((time.perf_counter() - t0) * 1000, 2)
    trace = list(state.get("trace", []))
    trace.append(
        {
            "node": "retrieve_rag_context",
            "chunksRetrieved": len(chunks),
            "embeddingBackend": rag.embedding_backend,
            "liveGithubAttached": github_ctx is not None,
            "durationMs": elapsed,
        }
    )
    return {
        "retrieved_chunks": chunks,
        "github_context": github_ctx,
        "sources": sources,
        "embedding_backend": rag.embedding_backend,
        "trace": trace,
    }


def route_after_retrieval(state: RagChatState) -> str:
    """Route directly to WhatsApp handoff if visitor requested direct messaging, else run LLM RAG."""
    if state["intent"] == "whatsapp_direct":
        return "whatsapp_handoff"
    return "llm_rag_synthesis"


async def llm_rag_synthesis_node(state: RagChatState) -> Dict[str, Any]:
    """Generate a real-time conversational answer using ChatGroq/LLM grounded in RAG chunks."""
    t0 = time.perf_counter()
    llm, model_name, mode = get_active_llm()
    chunks = state.get("retrieved_chunks", [])
    gh = state.get("github_context")

    if llm is None:
        elapsed = round((time.perf_counter() - t0) * 1000, 2)
        trace = list(state.get("trace", []))
        trace.append({"node": "llm_rag_synthesis", "status": "missing_api_key", "durationMs": elapsed})
        return {
            "answer": (
                "No live LLM API key is configured on the Python RAG server right now. "
                "Add GROQ_API_KEY, OPENAI_API_KEY, or GOOGLE_API_KEY in backend/.env, or click below "
                "to forward your question directly to Hashir on WhatsApp (+92 329 4222404)."
            ),
            "model": model_name,
            "mode": mode,
            "needs_whatsapp": True,
            "llm_error": "Missing GROQ_API_KEY / OPENAI_API_KEY / GOOGLE_API_KEY",
            "suggested_followups": [],
            "trace": trace,
        }

    context_sections = [
        f"[Chunk {i + 1} | Source: {c['source']} | Cosine Score: {c['score']}]\n{c['content']}"
        for i, c in enumerate(chunks)
    ]
    if gh:
        stats = gh.get("stats", {})
        repos = gh.get("latestRepos", [])[:5]
        repo_str = "; ".join(f"{r.get('name')} ({r.get('language')}, pushed {r.get('pushedAt')})" for r in repos)
        context_sections.append(
            f"[Live GitHub Telemetry]\n"
            f"Public Repos: {stats.get('totalRepos')}, Yearly Contributions: {stats.get('totalContributions')}, "
            f"Active Streak: {stats.get('currentStreak')} days, Longest Streak: {stats.get('longestStreak')} days. "
            f"Latest Repos: {repo_str}"
        )

    rag_context = "\n\n".join(context_sections)

    system_prompt = (
        "You are Hashir Ahmad's real-time RAG Identity Assistant on his engineering portfolio.\n"
        "Your job is to give helpful, human, accurate, real-life answers to visitors, recruiters, and clients "
        "using ONLY the retrieved portfolio & CV RAG context below plus conversation history.\n"
        "Rules:\n"
        "1. Be concise, natural, and direct. Do not invent projects, metrics, salaries, or employers not in context.\n"
        "2. When relevant, cite specific projects, URLs, certifications, or UET Peshawar / Wrapify Solutions details.\n"
        "3. ONLY if the visitor asks something genuinely NOT covered in the retrieved context (such as custom project pricing, "
        "hourly rates, private interview scheduling, private personal info, or reports a bug/problem) OR explicitly asks to talk directly to Hashir, "
        "state honestly what isn't covered, invite them to click 'Forward to WhatsApp', and append [ESCALATE_WHATSAPP] at the end. "
        "Do NOT append [ESCALATE_WHATSAPP] when the question is already fully answered by the retrieved context.\n"
        "4. Also provide Hashir's email (Hashirahmad801@gmail.com) or WhatsApp (+92 329 4222404 / 03294222404) whenever helpful.\n\n"
        f"RETRIEVED RAG CONTEXT:\n{rag_context}"
    )

    # Keep bounded recent conversation turns + current user question
    history_msgs = list(state.get("messages", []))[-7:-1]
    llm_messages: List[BaseMessage] = [SystemMessage(content=system_prompt)] + history_msgs + [
        HumanMessage(content=state["query"])
    ]

    try:
        response = await llm.ainvoke(llm_messages)
        raw_text = str(response.content).strip()
        needs_whatsapp = "[ESCALATE_WHATSAPP]" in raw_text
        clean_answer = raw_text.replace("[ESCALATE_WHATSAPP]", "").strip()
        llm_error = None
    except Exception as exc:
        clean_answer = (
            "The live LLM request encountered a temporary error while generating an answer. "
            "You can retry in a moment or forward your question directly to Hashir on WhatsApp (+92 329 4222404)."
        )
        needs_whatsapp = True
        llm_error = str(exc)
        mode = f"{mode}-error"

    elapsed = round((time.perf_counter() - t0) * 1000, 2)
    trace = list(state.get("trace", []))
    trace.append(
        {
            "node": "llm_rag_synthesis",
            "model": model_name,
            "mode": mode,
            "escalateWhatsapp": needs_whatsapp,
            "durationMs": elapsed,
        }
    )

    followups = [
        "Explain his LangGraph & RAG projects",
        "Tell me about his Wrapify Solutions internship",
        "Forward a message to Hashir on WhatsApp",
    ]
    return {
        "answer": clean_answer,
        "model": model_name,
        "mode": mode,
        "needs_whatsapp": needs_whatsapp,
        "llm_error": llm_error,
        "suggested_followups": followups,
        "messages": [AIMessage(content=clean_answer)],
        "trace": trace,
    }


def whatsapp_handoff_node(state: RagChatState) -> Dict[str, Any]:
    """Prepare a structured WhatsApp deep link forwarding the visitor's inquiry directly to Hashir."""
    t0 = time.perf_counter()
    url = build_whatsapp_forward_url(user_query=state["query"])

    existing_answer = state.get("answer", "").strip()
    if state["intent"] == "whatsapp_direct" and not existing_answer:
        llm, model_name, mode = get_active_llm()
        answer = (
            "You can connect directly with Hashir Ahmad on WhatsApp (+92 329 4222404). "
            "Click 'Forward to WhatsApp' below and your message will open pre-filled so Hashir receives it right away."
        )
        updates: Dict[str, Any] = {
            "answer": answer,
            "model": model_name,
            "mode": "whatsapp-direct-handoff",
            "needs_whatsapp": True,
            "suggested_followups": [
                "Ask about Hashir's full-stack & AI projects",
                "Check Hashir's certifications & education",
            ],
            "messages": [AIMessage(content=answer)],
        }
    else:
        updates = {}

    elapsed = round((time.perf_counter() - t0) * 1000, 2)
    trace = list(state.get("trace", []))
    trace.append({"node": "whatsapp_handoff", "whatsappReady": True, "durationMs": elapsed})
    updates["whatsapp_url"] = url
    updates["trace"] = trace
    return updates


def build_rag_graph():
    """Compile the LangGraph RAG StateGraph with MemorySaver checkpointing."""
    builder = StateGraph(RagChatState)
    builder.add_node("analyze_query", analyze_query_node)
    builder.add_node("retrieve_rag_context", retrieve_rag_context_node)
    builder.add_node("llm_rag_synthesis", llm_rag_synthesis_node)
    builder.add_node("whatsapp_handoff", whatsapp_handoff_node)

    builder.add_edge(START, "analyze_query")
    builder.add_edge("analyze_query", "retrieve_rag_context")
    builder.add_conditional_edges(
        "retrieve_rag_context",
        route_after_retrieval,
        {
            "llm_rag_synthesis": "llm_rag_synthesis",
            "whatsapp_handoff": "whatsapp_handoff",
        },
    )
    builder.add_edge("llm_rag_synthesis", "whatsapp_handoff")
    builder.add_edge("whatsapp_handoff", END)

    return builder.compile(checkpointer=MemorySaver())


RAG_GRAPH = build_rag_graph()


async def ask_rag_chatbot(message: str, thread_id: str = "visitor") -> Dict[str, Any]:
    """Invoke the real-time LangChain + LangGraph RAG chatbot."""
    t0 = time.perf_counter()
    result = await RAG_GRAPH.ainvoke(
        {
            "messages": [HumanMessage(content=message)],
            "query": message,
            "trace": [],
            "needs_whatsapp": False,
            "llm_error": None,
        },
        config={"configurable": {"thread_id": thread_id}},
    )
    total_ms = round((time.perf_counter() - t0) * 1000, 2)
    return {
        "answer": result["answer"],
        "intent": result["intent"],
        "sources": result.get("sources", []),
        "chunks": [
            {
                "source": c["source"],
                "category": c["category"],
                "score": c["score"],
                "excerpt": c["excerpt"],
            }
            for c in result.get("retrieved_chunks", [])
        ],
        "suggestedFollowups": result.get("suggested_followups", []),
        "model": result.get("model", "unknown"),
        "mode": result.get("mode", "unknown"),
        "embeddingBackend": result.get("embedding_backend", "local-dense-tfidf"),
        "needsWhatsapp": bool(result.get("needs_whatsapp", False)),
        "whatsappUrl": result.get("whatsapp_url") or build_whatsapp_forward_url(message),
        "llmError": result.get("llm_error"),
        "threadId": thread_id,
        "latencyMs": total_ms,
        "trace": result.get("trace", []),
    }
