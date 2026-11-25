"""FastAPI server for the real-time LangChain + LangGraph RAG Chatbot, WhatsApp Handoff & GitHub API."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Dict, List
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .github_service import fetch_github_activity
from .graph import WHATSAPP_NUMBER, ask_rag_chatbot, build_whatsapp_forward_url, get_active_llm
from .rag_store import get_rag_index

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

app = FastAPI(
    title="Hashir Ahmad — LangChain & LangGraph Real-Time RAG API",
    version="3.0.0",
    description="Real-time LangChain vector RAG + LangGraph StateGraph + Groq LLM + WhatsApp forwarding API.",
)

origins = [
    o.strip()
    for o in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:4321,http://127.0.0.1:4321,https://my-portfolios-sandy.vercel.app",
    ).split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1500, description="Visitor, client, or recruiter query")
    thread_id: str = Field(default="portfolio-visitor", min_length=1, max_length=80)


class WhatsAppForwardRequest(BaseModel):
    name: str = Field(default="", max_length=120)
    message: str = Field(..., min_length=1, max_length=1500)
    chat_context: str = Field(default="", max_length=500)


@app.get("/api/health")
async def health() -> Dict[str, Any]:
    llm, model_name, mode = get_active_llm()
    rag = get_rag_index()
    return {
        "ok": True,
        "llmConfigured": llm is not None,
        "model": model_name,
        "mode": mode,
        "ragChunks": len(rag.chunks),
        "embeddingBackend": rag.embedding_backend,
        "whatsappNumber": WHATSAPP_NUMBER,
        "whatsappDirectUrl": f"https://wa.me/{WHATSAPP_NUMBER}",
        "framework": "FastAPI + LangChain RAG + LangGraph + Groq",
    }


@app.post("/api/chat")
async def chat_endpoint(payload: ChatRequest) -> Dict[str, Any]:
    return await ask_rag_chatbot(payload.message.strip(), thread_id=payload.thread_id)


@app.post("/api/whatsapp/forward")
async def whatsapp_forward_endpoint(payload: WhatsAppForwardRequest) -> Dict[str, Any]:
    """Generate a structured pre-filled WhatsApp forwarding link straight to Hashir."""
    url = build_whatsapp_forward_url(
        user_query=payload.message.strip(),
        visitor_name=payload.name.strip(),
        note=payload.chat_context.strip(),
    )
    return {
        "ok": True,
        "whatsappNumber": WHATSAPP_NUMBER,
        "whatsappUrl": url,
    }


@app.get("/api/chat/test-suite")
async def run_rag_test_suite() -> Dict[str, Any]:
    """Run real end-to-end RAG + LLM verification across recruiter, technical, CV, and WhatsApp queries."""
    probes = [
        "Who is Hashir Ahmad and what university and GPA does he have?",
        "What did he work on during his Wrapify Solutions internship?",
        "Tell me about his Triostep Astro project and RAG vector pipeline.",
        "What is Hashir's custom freelance pricing for a 3-month enterprise SaaS build?",
    ]
    results: List[Dict[str, Any]] = []
    all_ok = True
    for i, prompt in enumerate(probes):
        res = await ask_rag_chatbot(prompt, thread_id=f"live-rag-test-{i}")
        if res.get("llmError"):
            all_ok = False
        results.append(
            {
                "query": prompt,
                "intent": res["intent"],
                "model": res["model"],
                "mode": res["mode"],
                "sources": res["sources"],
                "needsWhatsapp": res["needsWhatsapp"],
                "latencyMs": res["latencyMs"],
                "answerPreview": res["answer"][:200] + ("..." if len(res["answer"]) > 200 else ""),
            }
        )
    return {"passed": all_ok, "count": len(results), "results": results}


@app.get("/api/github")
async def github_endpoint(sync: bool = Query(default=False)) -> Dict[str, Any]:
    return await fetch_github_activity(force_refresh=sync)
