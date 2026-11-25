"""Real-time LangChain RAG ingestion, chunking, embeddings, and vector retrieval."""

from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from pypdf import PdfReader
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize

PROJECT_ROOT = Path(__file__).resolve().parents[2]


class LocalTfidfEmbeddings(Embeddings):
    """Hybrid word + subword L2-normalized TF-IDF embeddings for LangChain VectorStore."""

    def __init__(self, texts: List[str]) -> None:
        corpus = texts or ["hashir ahmad portfolio"]
        self.word_vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=1024,
            sublinear_tf=True,
            lowercase=True,
            stop_words="english",
        )
        self.char_vectorizer = TfidfVectorizer(
            analyzer="char_wb",
            ngram_range=(3, 5),
            max_features=1024,
            sublinear_tf=True,
            lowercase=True,
        )
        self.word_vectorizer.fit(corpus)
        self.char_vectorizer.fit(corpus)

    def _encode(self, texts: List[str]) -> List[List[float]]:
        w_vec = normalize(self.word_vectorizer.transform(texts).toarray().astype(np.float32), norm="l2")
        c_vec = normalize(self.char_vectorizer.transform(texts).toarray().astype(np.float32), norm="l2")
        combined = np.hstack([w_vec * 0.75, c_vec * 0.65])
        normed = normalize(combined, norm="l2")
        return normed.tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._encode(texts)

    def embed_query(self, text: str) -> List[float]:
        return self._encode([text])[0]


def _resolve_embeddings(corpus_texts: List[str]) -> Tuple[Embeddings, str]:
    """Select cloud embeddings when configured, otherwise dense local TF-IDF embeddings."""
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()
    if openai_key:
        from langchain_openai import OpenAIEmbeddings

        return OpenAIEmbeddings(api_key=openai_key), "openai-embeddings"

    google_key = os.getenv("GOOGLE_API_KEY", "").strip()
    if google_key:
        from langchain_google_genai import GoogleGenerativeAIEmbeddings

        return GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=google_key), "gemini-embeddings"

    return LocalTfidfEmbeddings(corpus_texts), "local-dense-tfidf"


def _load_source_documents() -> List[Document]:
    """Load real documents dynamically from My_cv.pdf, portfolio.ts, github-snapshot.json, and README.md."""
    docs: List[Document] = []

    # 1. Load actual CV PDF pages via pypdf into LangChain Documents
    cv_path = PROJECT_ROOT / "public" / "My_cv.pdf"
    if cv_path.exists():
        try:
            reader = PdfReader(str(cv_path))
            for idx, page in enumerate(reader.pages):
                cleaned = re.sub(r"\s+", " ", page.extract_text() or "").strip()
                if cleaned:
                    # Keep historical CV PDF untouched on disk while serving Hashir's current contact details to RAG
                    cleaned = re.sub(r"hashirahmad809@gmail\.com", "Hashirahmad801@gmail.com", cleaned, flags=re.IGNORECASE)
                    cleaned = cleaned.replace("0370-5105561", "03294222404 (+92 329 4222404)")
                    docs.append(
                        Document(
                            page_content=cleaned,
                            metadata={"source": f"My_cv.pdf (page {idx + 1})", "category": "cv"},
                        )
                    )
        except Exception:
            pass

    # 2. Load structured portfolio records directly from src/data/portfolio.ts split by section
    portfolio_ts = PROJECT_ROOT / "src" / "data" / "portfolio.ts"
    if portfolio_ts.exists():
        raw_ts = portfolio_ts.read_text(encoding="utf-8")
        parts = re.split(r"(?=^export const )", raw_ts, flags=re.MULTILINE)
        for part in parts:
            if not part.strip().startswith("export const "):
                continue
            header_match = re.match(r"export const\s+([A-Z0-9_]+)", part)
            sec_name = header_match.group(1) if header_match else "DATA"
            cleaned_sec = re.sub(r"code:\s*`[\s\S]*?`,", "", part)
            cleaned_sec = re.sub(r"[{}\[\]'\"]", " ", cleaned_sec)
            cleaned_sec = "\n".join(
                re.sub(r"[ \t]+", " ", line).strip()
                for line in cleaned_sec.splitlines()
                if line.strip()
            )
            if cleaned_sec:
                docs.append(
                    Document(
                        page_content=f"[Portfolio Section: {sec_name}]\n{cleaned_sec}",
                        metadata={"source": f"src/data/portfolio.ts#{sec_name}", "category": "portfolio"},
                    )
                )

    # 3. Load GitHub snapshot summary
    gh_path = PROJECT_ROOT / "src" / "data" / "github-snapshot.json"
    if gh_path.exists():
        try:
            gh = json.loads(gh_path.read_text(encoding="utf-8"))
            stats = gh.get("stats", {})
            repos = gh.get("latestRepos", [])
            langs = gh.get("languages", [])
            repo_lines = "; ".join(
                f"{r.get('name')} ({r.get('language')}, pushed {r.get('pushedAt')}): {r.get('description')}"
                for r in repos
            )
            lang_lines = ", ".join(f"{l.get('name')} {l.get('percentage')}%" for l in langs)
            docs.append(
                Document(
                    page_content=(
                        f"GitHub Profile @{gh.get('profile', {}).get('username', 'hashirahmad806')}: "
                        f"{stats.get('totalRepos', 49)} public repositories, "
                        f"{stats.get('totalContributions', 248)} contributions in the last year, "
                        f"active streak {stats.get('currentStreak', 8)} days, "
                        f"longest streak {stats.get('longestStreak', 9)} days. "
                        f"Primary languages: {lang_lines}. "
                        f"Latest repositories: {repo_lines}."
                    ),
                    metadata={"source": "src/data/github-snapshot.json", "category": "github"},
                )
            )
        except Exception:
            pass

    # 4. Direct Contact & WhatsApp Guidance Document
    docs.append(
        Document(
            page_content=(
                "Direct Contact & Escalation Channels for Hashir Ahmad: "
                "Primary Recruiter Email: Hashirahmad801@gmail.com. "
                "Direct WhatsApp & Phone: +92 329 4222404 / 03294222404 (https://wa.me/923294222404). "
                "LinkedIn: https://www.linkedin.com/in/hashir-ahmad-25639031b. "
                "GitHub: https://github.com/hashirahmad806. "
                "Location: Peshawar, Pakistan (Open to Remote Roles, Internships, Full-Time Engineering, and Freelance Client Projects). "
                "If a visitor or client has a custom project inquiry, pricing question, urgent hiring question, or needs direct human assistance, "
                "they can send a direct message to Hashir on WhatsApp at +92 329 4222404 (03294222404)."
            ),
            metadata={"source": "Direct Contact & WhatsApp Policy", "category": "contact"},
        )
    )

    return docs


class PortfolioRAGIndex:
    """In-memory LangChain Vector Store index over Hashir's portfolio, CV PDF, and GitHub stats."""

    def __init__(self) -> None:
        self.raw_docs = _load_source_documents()
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=850,
            chunk_overlap=160,
            separators=["\n\n", "\n", ". ", ", ", " "],
        )
        self.chunks: List[Document] = self.splitter.split_documents(self.raw_docs)
        self.embeddings, self.embedding_backend = _resolve_embeddings(
            [c.page_content for c in self.chunks]
        )
        self.vector_store = InMemoryVectorStore.from_documents(
            documents=self.chunks,
            embedding=self.embeddings,
        )

    def similarity_search(self, query: str, k: int = 6) -> List[Tuple[Document, float]]:
        """Run Maximal Marginal Relevance (MMR) cosine search for diverse multi-topic RAG recall."""
        fetch_k = min(len(self.chunks), max(k * 3, 18))
        candidates = self.vector_store.similarity_search_with_score(query, k=fetch_k)
        if len(candidates) <= k:
            return candidates

        doc_vecs = np.asarray(
            self.embeddings.embed_documents([doc.page_content for doc, _ in candidates]),
            dtype=np.float32,
        )
        selected_indices: List[int] = [0]
        remaining = list(range(1, len(candidates)))
        lambda_mult = 0.62

        while len(selected_indices) < k and remaining:
            best_idx = remaining[0]
            best_mmr = -1e9
            sel_vecs = doc_vecs[selected_indices]
            for idx in remaining:
                rel = float(candidates[idx][1])
                redundancy = float(np.max(sel_vecs @ doc_vecs[idx]))
                mmr_score = lambda_mult * rel - (1.0 - lambda_mult) * redundancy
                if mmr_score > best_mmr:
                    best_mmr = mmr_score
                    best_idx = idx
            selected_indices.append(best_idx)
            remaining.remove(best_idx)

        return [candidates[i] for i in selected_indices]


_rag_index: Optional[PortfolioRAGIndex] = None


def get_rag_index() -> PortfolioRAGIndex:
    global _rag_index
    if _rag_index is None:
        _rag_index = PortfolioRAGIndex()
    return _rag_index
