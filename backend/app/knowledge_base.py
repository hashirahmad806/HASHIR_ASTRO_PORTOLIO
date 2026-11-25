"""Curated LangChain Document corpus representing Hashir Ahmad's verified identity."""

from __future__ import annotations

import re
from typing import List, Tuple
from langchain_core.documents import Document


IDENTITY_DOCUMENTS: List[Document] = [
    Document(
        page_content=(
            "Hashir Ahmad is a Full-Stack & AI Systems Engineer based in Peshawar, Pakistan "
            "(open to remote roles and relocation). He is pursuing a Bachelor of Science in "
            "Computer Science at the University of Engineering & Technology (UET), Peshawar "
            "(2024-2028) with a CGPA of 3.45 / 4.0. His work focuses on bridging human-centered "
            "product interfaces (Astro, React 19, TypeScript, Tailwind CSS, GSAP) with autonomous "
            "AI agents (LangChain, LangGraph), sub-20ms MongoDB Atlas Vector Search RAG pipelines, "
            "and applied deep learning."
        ),
        metadata={"topic": "identity", "title": "Profile & Education", "keywords": "who hashir ahmad bio summary uet peshawar cgpa education degree location"},
    ),
    Document(
        page_content=(
            "Work Experience: Hashir Ahmad worked as a Full Stack Development Intern at Wrapify Solutions "
            "from November 2025 to January 2026 (3-month production internship). During this term, "
            "he engineered responsive component-based UIs and server-side API logic that shipped to "
            "production, collaborated inside an existing codebase without regressions, and debugged "
            "client-facing features alongside senior engineers. He also delivers commercial client web "
            "systems independently."
        ),
        metadata={"topic": "experience", "title": "Wrapify Solutions Internship & Work History", "keywords": "experience internship wrapify solutions job work history commercial freelance"},
    ),
    Document(
        page_content=(
            "Commercial Client Projects: "
            "1) Triostep Heritage Footwear (https://triostepdkhyber.vercel.app/): A headless Astro "
            "e-commerce storefront decoupled from WordPress/WooCommerce featuring instant filtering by "
            "size and material, responsive cart drawer, and direct WhatsApp order concierge. "
            "2) Dr. Hassan BDS Dental Clinic (https://hassanbds.info): A TypeScript/React clinical "
            "platform with interactive appointment booking, treatment breakdowns, and smile makeover "
            "before/after comparison galleries."
        ),
        metadata={"topic": "client_projects", "title": "Commercial Client Deliveries", "keywords": "client triostep footwear ecommerce astro hassan dental clinic projects live"},
    ),
    Document(
        page_content=(
            "AI Agents, RAG & Deep Learning Projects: "
            "1) Production RAG & Vector Pipeline (github.com/hashirahmad806/Lang_chain_Learning): "
            "LangChain + MongoDB Atlas Vector Search executing Cosine ANN retrieval in under 18ms "
            "with source-cited grounded responses. "
            "2) AI Codebase Memory & Multi-Agent Graph (github.com/hashirahmad806/AI_Codebase_Memory): "
            "Cyclic LangGraph state machine with MemorySaver checkpoints and schema-validated tools. "
            "3) PlantVillage Crop Pathology CNN (github.com/hashirahmad806/Plant_Village_Deep_Learing_Project): "
            "TensorFlow/Keras CNN plant disease classifier deployed across React web, React Native mobile, and GCP. "
            "4) Lumina Multimodal Study Assistant & QuickBlogs AI CMS & Commit Roulette (React 19 + TS)."
        ),
        metadata={"topic": "ai_projects", "title": "AI Systems, RAG & Deep Learning Builds", "keywords": "projects rag vector langchain langgraph codebase memory plant village cnn lumina quickblogs commit roulette reelnova"},
    ),
    Document(
        page_content=(
            "Technical Skills & Stack: "
            "Languages: JavaScript, TypeScript, Python, Java, C++, HTML/CSS. "
            "Frontend & Motion: Astro, React.js (React 19), Tailwind CSS, Vite, GSAP ScrollTrigger, Lenis, Material UI. "
            "Backend & Databases: Node.js, Express.js, FastAPI, MongoDB, Mongoose ODM, MongoDB Atlas Vector Search, Appwrite, JWT/bcrypt. "
            "AI & Machine Learning: LangChain, LangGraph, RAG Pipelines, OpenAI API, Groq Vision, TensorFlow, Keras, PyTorch, Scikit-Learn, Computer Vision."
        ),
        metadata={"topic": "skills", "title": "Technical Architecture & Stack", "keywords": "skills tech stack languages frameworks astro react node express mongodb python pytorch tensorflow langchain langgraph"},
    ),
    Document(
        page_content=(
            "Verified Certifications (8 total): "
            "1) Microsoft Certified: Azure AI Fundamentals (Jun 2026, ID: 6B28946001D96051). "
            "2) Machine Learning & Deep Learning (3-Month Intensive Program) — NAVTTC. "
            "3) Human Factors in AI — Duke University via Coursera (May 2026, ID: A6X7RU2OWASD). "
            "4) Computer Vision and Image Processing Essentials (V2) — IBM via Coursera/Credly (Jul 2026). "
            "5) AI Fundamentals — Google via Coursera (Jul 2026). "
            "6) Managing Data Analysis — Johns Hopkins University via Coursera (Jul 2026). "
            "7) Introduction to Cybersecurity Essentials — IBM via Coursera (May 2026). "
            "8) Frontend Development using React — Board Infinity via Coursera (May 2026)."
        ),
        metadata={"topic": "certifications", "title": "8 Verified Certifications", "keywords": "certificates certifications microsoft azure ai navttc duke human factors ibm google johns hopkins react"},
    ),
    Document(
        page_content=(
            "Contact & Hiring Availability: Hashir Ahmad is open to Software Engineering internships, "
            "Full-Stack Engineer roles, and AI/Agentic Systems opportunities (remote or relocation). "
            "Primary Email: Hashirahmad801@gmail.com | WhatsApp/Phone: +92 329 4222404 (03294222404) | "
            "GitHub: https://github.com/hashirahmad806 | "
            "LinkedIn: https://www.linkedin.com/in/hashir-ahmad-25639031b | "
            "Portfolio: https://my-portfolios-sandy.vercel.app"
        ),
        metadata={"topic": "contact", "title": "Contact, Resume & Availability", "keywords": "contact hire email phone whatsapp linkedin github cv resume available opportunity"},
    ),
]


def retrieve_relevant_documents(query: str, top_k: int = 3) -> List[Tuple[Document, float]]:
    """Score and retrieve top-k identity documents using normalized token overlap + metadata boosting."""
    tokens = {t for t in re.findall(r"[a-z0-9]+", query.lower()) if len(t) > 1}
    if not tokens:
        return [(IDENTITY_DOCUMENTS[0], 1.0), (IDENTITY_DOCUMENTS[1], 0.8)]

    scored: List[Tuple[Document, float]] = []
    for doc in IDENTITY_DOCUMENTS:
        body_tokens = set(re.findall(r"[a-z0-9]+", doc.page_content.lower()))
        kw_tokens = set(re.findall(r"[a-z0-9]+", str(doc.metadata.get("keywords", "")).lower()))
        body_hits = len(tokens & body_tokens)
        kw_hits = len(tokens & kw_tokens)
        score = body_hits * 1.0 + kw_hits * 1.65
        if score > 0:
            scored.append((doc, round(score, 2)))

    scored.sort(key=lambda pair: pair[1], reverse=True)
    if not scored:
        return [(IDENTITY_DOCUMENTS[0], 0.5), (IDENTITY_DOCUMENTS[6], 0.4)]
    return scored[:top_k]
