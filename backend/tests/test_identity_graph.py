"""Tests for real LangChain vector RAG ingestion, LangGraph routing, WhatsApp forwarding, and FastAPI."""

from __future__ import annotations

import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.rag_store import get_rag_index
from app.graph import ask_rag_chatbot, build_whatsapp_forward_url

client = TestClient(app)


def test_rag_index_loads_cv_and_portfolio_chunks():
    rag = get_rag_index()
    assert len(rag.chunks) >= 5
    sources = {c.metadata.get("source", "") for c in rag.chunks}
    assert any("My_cv.pdf" in s for s in sources)
    assert any("portfolio.ts" in s for s in sources)

    hits = rag.similarity_search("Wrapify Solutions internship and UET Peshawar", k=3)
    assert len(hits) == 3
    joined = " ".join(doc.page_content for doc, _ in hits)
    assert "Wrapify" in joined

    compound_hits = rag.similarity_search("What is Hashir university CGPA and where did he intern?", k=6)
    compound_text = " ".join(doc.page_content for doc, _ in compound_hits)
    assert "3.45" in compound_text
    assert "Wrapify" in compound_text

    contact_hits = rag.similarity_search("How can I email or WhatsApp Hashir directly?", k=4)
    contact_text = " ".join(doc.page_content for doc, _ in contact_hits)
    assert "Hashirahmad801@gmail.com" in contact_text
    assert "923294222404" in contact_text
    assert "hashirahmad809@gmail.com" not in contact_text
    assert "0370-5105561" not in contact_text


def test_health_endpoint_reports_rag_and_llm():
    res = client.get("/api/health")
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert body["ragChunks"] >= 5
    assert body["whatsappNumber"] == "923294222404"


def test_whatsapp_forward_endpoint_encodes_message():
    res = client.post(
        "/api/whatsapp/forward",
        json={"name": "Sara", "message": "I want to hire Hashir for an Astro site"},
    )
    assert res.status_code == 200
    url = res.json()["whatsappUrl"]
    assert url.startswith("https://wa.me/923294222404?text=")
    assert "Sara" in url
    assert "Astro" in url


def test_whatsapp_direct_intent_skips_llm_and_hands_off():
    res = client.post(
        "/api/chat",
        json={"message": "Please connect me to Hashir on WhatsApp", "thread_id": "wa-test"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["intent"] == "whatsapp_direct"
    assert data["needsWhatsapp"] is True
    assert data["whatsappUrl"].startswith("https://wa.me/923294222404?text=")
    assert [t["node"] for t in data["trace"]] == [
        "analyze_query",
        "retrieve_rag_context",
        "whatsapp_handoff",
    ]


def test_rag_llm_synthesis_runs_with_mocked_llm():
    fake_llm = AsyncMock()
    fake_llm.ainvoke = AsyncMock(
        return_value=SimpleNamespace(
            content="Hashir studied CS at UET Peshawar (3.45 GPA) and interned at Wrapify Solutions."
        )
    )
    with patch("app.graph.get_active_llm", return_value=(fake_llm, "llama-3.3-70b-versatile", "groq-rag-live")):
        res = asyncio.run(ask_rag_chatbot("Where did Hashir intern and what is his GPA?", "unit-rag"))
        assert res["mode"] == "groq-rag-live"
        assert "Wrapify Solutions" in res["answer"]
        assert len(res["chunks"]) > 0
        assert [t["node"] for t in res["trace"]] == [
            "analyze_query",
            "retrieve_rag_context",
            "llm_rag_synthesis",
            "whatsapp_handoff",
        ]
