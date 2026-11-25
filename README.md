# Hashir Ahmad — Nocturne Basalt Portfolio & LangGraph Identity API

An editorial, high-SEO personal engineering portfolio engineered with **Astro**, **Tailwind CSS v4**, **GSAP + ScrollTrigger + Lenis**, Google-Lens-inspired optical motion, and a **Python LangChain + LangGraph Identity Chatbot testing API**.

---

## Live GitHub Activity (`@hashirahmad806`)

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=hashirahmad806&theme=tokyonight&hide_border=true&include_all_commits=true&count_private=true&show_icons=true&bg_color=080B0A&title_color=4FE3B5&icon_color=E8B88A&text_color=F2EFE9&custom_title=Hashir%20Ahmad%20%E2%80%94%20GitHub%20Stats" height="175" alt="Hashir Ahmad GitHub Stats" />
  &nbsp;&nbsp;
  <img src="https://streak-stats.demolab.com?user=hashirahmad806&theme=tokyonight&hide_border=true&background=080B0A&stroke=151C19&ring=4FE3B5&fire=E8B88A&currStreakLabel=4FE3B5&sideLabels=F2EFE9&currStreakNum=F2EFE9&sideNums=F2EFE9&dates=85948D" height="175" alt="Hashir Ahmad GitHub Streak" />
</p>

<p align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=hashirahmad806&bg_color=080B0A&color=B6C2BC&line=4FE3B5&point=E8B88A&area=true&area_color=151C19&hide_border=true&custom_title=Contribution%20Velocity" width="96%" alt="Hashir Ahmad Activity Graph" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/hashirahmad806/hashirahmad806/output/github-contribution-grid-snake-dark.svg" alt="Hashir Ahmad Contribution Snake" width="90%" />
</p>

### Snapshot Metrics (Synced `2026-11-25`)
- **Public Repositories:** `49` ([github.com/hashirahmad806](https://github.com/hashirahmad806))
- **Contributions (Last 365 Days):** `248` contributions scraped directly from GitHub calendar
- **Recent Active Repositories:** `LangChain_Projects`, `Lang_chain_Learning`, `my_Portfolios`, `triostepdkhyber`, `Hassan_Web`, `commit-roulette`, `Plant_Village_Deep_Learing_Project`

---

## Architecture Overview

```text
NEw_version_portfilio/
├── src/
│   ├── layouts/BaseLayout.astro          # High-SEO meta, OpenGraph, JSON-LD @graph
│   ├── styles/global.css                 # Nocturne Basalt & Verdigris Jade tokens + optical lens styles
│   ├── data/
│   │   ├── portfolio.ts                  # Curated identity, 9 projects, Wrapify internship, 8 certs
│   │   └── github-snapshot.json          # Real GitHub stats + 52-week contribution calendar
│   ├── components/
│   │   ├── Navbar.astro                  # Detached glass pill, Lens Focus toggle, Command palette trigger
│   │   ├── Hero.astro                    # Asymmetric hero, role ticker, magnetic CTAs, optical viewfinder
│   │   ├── Projects.astro                # Double-bezel bento showcase + Architecture modal
│   │   ├── CapabilityWorkbench.astro     # Interactive stack inspector + ReAct cognitive loop
│   │   ├── ExperienceCerts.astro         # Wrapify Solutions certificate preview + 8 certifications
│   │   ├── GitHubPulse.astro             # 52-week contribution heatmap, streaks, languages & commits
│   │   ├── IdentityChatbot.astro         # Floating LangChain/LangGraph RAG Chatbot + WhatsApp direct forwarder
│   │   ├── Contact.astro                 # Recruiter brief composer + Hashirahmad801@gmail.com
│   │   └── CommandLensModal.astro        # Keyboard-first Cmd/Ctrl+K palette
│   └── scripts/optical-motion.ts         # GSAP ScrollTrigger, Lenis, 3D tilt, magnetic physics & RAG API wiring
├── backend/                              # Python FastAPI + LangChain + LangGraph Real-Time RAG API
│   ├── app/
│   │   ├── rag_store.py                  # Vector RAG over My_cv.pdf, portfolio.ts & GitHub snapshot
│   │   ├── graph.py                      # LangGraph StateGraph + Groq/OpenAI/Gemini LLM synthesis + WhatsApp handoff
│   │   ├── github_service.py             # Live GitHub API + contribution heatmap scraper
│   │   └── main.py                       # FastAPI endpoints (/api/chat, /api/whatsapp/forward, /api/chat/test-suite, /api/github)
│   ├── tests/test_identity_graph.py      # Automated pytest verification suite
│   └── requirements.txt
└── design-system/                        # UI/UX Pro Max design system tokens & MASTER.md
```

---

## Running Locally

### 1. Astro Frontend
```bash
npm install
npm run dev
# Local site: http://localhost:4321
```

### 2. Python LangChain + LangGraph Real-Time RAG Chatbot API
```bash
cd backend
pip install -r requirements.txt
# Copy .env.example to .env and set GROQ_API_KEY (default model: openai/gpt-oss-120b), OPENAI_API_KEY, or GOOGLE_API_KEY
# Includes real-time vector retrieval over My_cv.pdf + portfolio.ts + 1-click WhatsApp forwarding (+92 329 4222404)
python -m uvicorn app.main:app --reload --port 8000
```

### 3. Run Backend & Frontend Verification
```bash
# Python LangGraph + FastAPI test suite
pytest backend/tests/test_identity_graph.py -v

# Astro type check & production build
npm run check
npm run build
```

---

## Contact
- **Email:** `Hashirahmad801@gmail.com`
- **Phone / WhatsApp:** `+92 329 4222404` (`03294222404`)
- **LinkedIn:** [linkedin.com/in/hashir-ahmad-25639031b](https://www.linkedin.com/in/hashir-ahmad-25639031b)
- **GitHub:** [github.com/hashirahmad806](https://github.com/hashirahmad806)
