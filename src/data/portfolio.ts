export interface ProjectItem {
  id: string;
  title: string;
  category: 'client' | 'ai' | 'fullstack' | 'ml';
  tag: string;
  domain: string;
  isClient: boolean;
  clientName?: string;
  shortDesc: string;
  fullDesc: string;
  humanImpact: string;
  metrics: string[];
  highlights: string[];
  tech: string[];
  accentTone: 'jade' | 'copper' | 'mineral';
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  lensTelemetry: {
    architecture: string;
    latencyOrOutcome: string;
    stackFocus: string;
  };
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  platform: string;
  date: string;
  badgeCode: string;
  summary: string;
  file?: string;
  verifyUrl?: string;
  credentialId?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  type: 'Internship' | 'Commercial' | 'Engineering' | 'Academic';
  summary: string;
  points: string[];
  proofAsset?: {
    label: string;
    href: string;
  };
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'ai' | 'frontend' | 'backend';
  tag: string;
  maturity: string;
  latency: string;
  tenure: string;
  role: string;
  language: string;
  code: string;
  projectLink: string;
}

export const PROFILE = {
  name: 'Hashir Ahmad',
  shortName: 'Hashir',
  role: 'Full-Stack & AI Systems Engineer',
  subHeadline: 'Designing human-centered software, autonomous AI workflows, and fast Astro/React web products.',
  availability: 'Open to Full-Stack & AI Engineering Roles · 2026',
  location: 'Peshawar, Pakistan · Remote & Relocation Ready',
  email: 'Hashirahmad801@gmail.com',
  phoneDisplay: '+92 329 4222404',
  whatsappUrl: 'https://wa.me/923294222404',
  githubHandle: 'hashirahmad806',
  githubUrl: 'https://github.com/hashirahmad806',
  linkedinUrl: 'https://www.linkedin.com/in/hashir-ahmad-25639031b',
  cvUrl: '/My_cv.pdf',
  siteUrl: 'https://my-portfolios-sandy.vercel.app',
  education: {
    degree: 'B.S. Computer Science',
    institution: 'University of Engineering & Technology (UET), Peshawar',
    period: '2024 – 2028',
    cgpa: '3.45 / 4.0',
    focus: 'Applied Deep Learning, Data Science, Systems Engineering & Human Factors in AI',
  },
  snapshotMetrics: [
    { label: 'Shipped Systems', value: '9+', detail: 'Client apps, AI agents & CNNs' },
    { label: 'Verified Certs', value: '8', detail: 'Microsoft, IBM, Google, Duke, JHU' },
    { label: 'UET · CS GPA', value: '3.45', detail: 'CGPA / 4.0 · Class of 2028' },
  ],
};

export const THINK_EXECUTE_PILLARS = [
  {
    id: 'agents',
    title: 'Autonomous AI Agents',
    subtitle: 'Stateful plans, not brittle prompts',
    tag: 'LangGraph & LangChain',
    badge: 'Self-Correcting',
    summary:
      'Most demos stop at chat text. I design cyclic state machines that break goals into validated steps, invoke real tools, and recover gracefully when APIs fail.',
    highlights: [
      'Multi-step cyclic LangGraph routing',
      'Deterministic tool & API schemas',
      'Persistent memory & reflection loops',
    ],
  },
  {
    id: 'rag',
    title: 'Production RAG Systems',
    subtitle: 'Grounded answers from private data',
    tag: 'MongoDB Atlas Vector Search',
    badge: '< 20ms Recall',
    summary:
      'Connects language models to real company documents via cosine ANN vector indexes so teams get cited, auditable answers without guessing.',
    highlights: [
      'Sub-20ms semantic ANN retrieval',
      'Source-grounded citation boundaries',
      'Event-driven document re-indexing',
    ],
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Web Craft',
    subtitle: 'Astro speed & MERN reliability',
    tag: 'Astro · React · Node · MongoDB',
    badge: 'Shipped to Clients',
    summary:
      'Production storefronts, clinical platforms, and authenticated SaaS applications engineered for fast initial paint, strict accessibility, and maintainable APIs.',
    highlights: [
      'Zero-bloat Astro SSG & React UIs',
      'JWT & bcrypt secured Express APIs',
      'WCAG contrast & keyboard-first UX',
    ],
  },
  {
    id: 'hci',
    title: 'Human Factors & Applied ML',
    subtitle: 'Math + human clarity combined',
    tag: 'Duke HCI + PyTorch / TensorFlow',
    badge: 'Human-Centered',
    summary:
      'Grounded in UET Peshawar Computer Science and Duke University Human Factors in AI — pairing neural architectures with interfaces people actually trust.',
    highlights: [
      'CNN & LSTM deep learning models',
      'Cognitive load & Fitts’s Law ergonomics',
      'Transparent AI uncertainty cues',
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'triostep',
    title: 'Triostep Heritage Footwear',
    category: 'client',
    tag: 'Commercial Client Delivery',
    domain: 'triostepdkhyber.vercel.app',
    isClient: true,
    clientName: 'Triostep Heritage Footwear',
    shortDesc:
      'Headless Astro e-commerce storefront for handcrafted artisan leather footwear, decoupled from WordPress/WooCommerce for instant browsing and WhatsApp concierge checkout.',
    fullDesc:
      'Delivered a production commercial e-commerce platform for an artisan footwear atelier. Decoupled a blazing-fast Astro frontend from WordPress/WooCommerce, featuring lookbook galleries, instant client-side catalog filtering by size and craft, a smooth slide-out cart drawer, and direct WhatsApp order routing.',
    humanImpact: 'Eliminated slow monolithic theme reloads so mobile shoppers browse and order in seconds.',
    metrics: ['Headless Astro', 'WhatsApp Concierge'],
    highlights: [
      'Decoupled Astro storefront backed by WordPress/WooCommerce',
      'Instant filtering by size, leather finish, and price tier',
      'Direct one-tap WhatsApp order concierge for buyers',
    ],
    tech: ['Astro', 'Tailwind CSS', 'JavaScript', 'Headless WooCommerce'],
    accentTone: 'copper',
    githubUrl: 'https://github.com/hashirahmad806/triostepdkhyber',
    liveUrl: 'https://triostepdkhyber.vercel.app/',
    featured: true,
    lensTelemetry: {
      architecture: 'Static Edge Shell + Headless WooCommerce REST',
      latencyOrOutcome: 'Zero monolithic theme bloat · Mobile-first checkout',
      stackFocus: 'Astro · Tailwind · Client-side Filter Engine',
    },
  },
  {
    id: 'hassan-dental',
    title: 'Dr. Hassan BDS Dental Clinic',
    category: 'client',
    tag: 'Healthcare Client Delivery',
    domain: 'hassanbds.info',
    isClient: true,
    clientName: 'Dr. Hassan Dental Surgery',
    shortDesc:
      'Patient-first healthcare platform featuring interactive appointment booking, clinical service breakdowns, and smile makeover comparison galleries.',
    fullDesc:
      'Designed and shipped the digital flagship for Dr. Hassan BDS. Replaced cluttered clinical forms with calm editorial pacing, validated consultation booking flows, before/after smile makeover comparisons, and mobile-first patient navigation.',
    humanImpact: 'Reduced patient booking friction through clear visual hierarchy and calm healthcare trust cues.',
    metrics: ['Live Clinical Site', 'Booking Flow'],
    highlights: [
      'Interactive consultation booking with inline validation',
      'Before & after smile makeover comparison gallery',
      'Mobile-first responsive architecture built with TypeScript & React',
    ],
    tech: ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
    accentTone: 'jade',
    githubUrl: 'https://github.com/hashirahmad806/Hassan_Web',
    liveUrl: 'https://hassanbds.info',
    featured: true,
    lensTelemetry: {
      architecture: 'Component-Driven Clinical SPA',
      latencyOrOutcome: 'Production domain live @ hassanbds.info',
      stackFocus: 'TypeScript · React · Patient UX Flow',
    },
  },
  {
    id: 'rag-pipeline',
    title: 'Production RAG & Vector Pipeline',
    category: 'ai',
    tag: 'Enterprise AI & Vectors',
    domain: 'github.com/hashirahmad806/Lang_chain_Learning',
    isClient: false,
    shortDesc:
      'High-speed knowledge retrieval pipeline using LangChain and MongoDB Atlas Vector Search to answer queries from private documents with verified citations.',
    fullDesc:
      'An end-to-end Retrieval-Augmented Generation architecture. Chunks and embeds multi-format knowledge repositories into MongoDB Atlas Vector Search, executes Cosine ANN retrieval in under 20ms, and enforces strict source-citation grounding to eliminate unsupported claims.',
    humanImpact: 'Turns opaque LLM generation into verifiable, citation-backed answers teams can audit.',
    metrics: ['< 18ms Vector Recall', 'Cited Grounding'],
    highlights: [
      'Sub-20ms Cosine ANN similarity retrieval across indexed chunks',
      'Automated Atlas trigger pipeline for document embedding sync',
      'Grounded synthesis with explicit source chunk references',
    ],
    tech: ['Python', 'LangChain', 'MongoDB Vector Search', 'OpenAI'],
    accentTone: 'jade',
    githubUrl: 'https://github.com/hashirahmad806/Lang_chain_Learning',
    liveUrl: 'https://github.com/hashirahmad806/Lang_chain_Learning',
    featured: true,
    lensTelemetry: {
      architecture: 'Chunker → Embeddings → Atlas ANN → Grounded LLM',
      latencyOrOutcome: '~18ms median vector lookup · Cited responses',
      stackFocus: 'Python · LangChain · MongoDB Atlas',
    },
  },
  {
    id: 'codebase-memory',
    title: 'AI Codebase Memory & Multi-Agent Graph',
    category: 'ai',
    tag: 'Autonomous Multi-Agent',
    domain: 'github.com/hashirahmad806/AI_Codebase_Memory',
    isClient: false,
    shortDesc:
      'Stateful LangGraph agent architecture with persistent memory checkpoints that maps repositories, plans multi-file changes, and validates tool outputs.',
    fullDesc:
      'A cyclic multi-agent engineering workflow powered by LangGraph. Maintains persistent execution checkpoints across turns, employs conditional routing between repository retrieval and code-planning nodes, and enforces deterministic tool validation.',
    humanImpact: 'Keeps long-running coding agents predictable and inspectable across multi-step tasks.',
    metrics: ['LangGraph Cyclic', 'Persistent State'],
    highlights: [
      'Stateful LangGraph machine with self-correction edges',
      'Checkpointed memory threads across multi-turn sessions',
      'Structured tool calling with schema validation boundaries',
    ],
    tech: ['Python', 'LangGraph', 'Multi-Agent Swarms', 'Vector Store'],
    accentTone: 'copper',
    githubUrl: 'https://github.com/hashirahmad806/AI_Codebase_Memory',
    liveUrl: 'https://github.com/hashirahmad806/AI_Codebase_Memory',
    featured: true,
    lensTelemetry: {
      architecture: 'StateGraph(AgentState) + Conditional Edge Router',
      latencyOrOutcome: 'Deterministic tool validation & checkpoint memory',
      stackFocus: 'LangGraph · ReAct Loops · Context Compaction',
    },
  },
  {
    id: 'plant-village',
    title: 'PlantVillage Crop Pathology CNN',
    category: 'ml',
    tag: 'Deep Learning & Vision',
    domain: 'github.com/hashirahmad806/Plant_Village_Deep_Learing_Project',
    isClient: false,
    shortDesc:
      'End-to-end plant disease detection system combining a trained TensorFlow/Keras CNN model with React web, React Native mobile, and Google Cloud deployment.',
    fullDesc:
      'Built a full multi-platform agricultural diagnostics suite. Trained a Convolutional Neural Network on crop leaf pathology datasets using TensorFlow/Keras, served inference through cloud APIs on Google Cloud Platform, and delivered both React web and React Native mobile interfaces for farmers and agronomists.',
    humanImpact: 'Brings instant visual crop-health diagnostics from a laptop or phone camera directly to growers.',
    metrics: ['CNN Vision', 'Web + Mobile + GCP'],
    highlights: [
      'Custom-trained TensorFlow/Keras CNN leaf disease classifier',
      'Cross-platform delivery via React.js web & React Native mobile',
      'Deployed inference pipeline on Google Cloud Platform',
    ],
    tech: ['TensorFlow', 'Keras', 'React.js', 'React Native', 'GCP'],
    accentTone: 'jade',
    githubUrl: 'https://github.com/hashirahmad806/Plant_Village_Deep_Learing_Project',
    liveUrl: 'https://github.com/hashirahmad806/Plant_Village_Deep_Learing_Project',
    featured: true,
    lensTelemetry: {
      architecture: 'Leaf Image → CNN Inference API → React / Mobile UI',
      latencyOrOutcome: 'Multi-platform web + mobile deployment on GCP',
      stackFocus: 'Computer Vision · TensorFlow · React Native',
    },
  },
  {
    id: 'lumina-assistant',
    title: 'Lumina Multimodal Study Assistant',
    category: 'fullstack',
    tag: 'Multimodal MERN App',
    domain: 'web-projectect-ai-assistant-x8xz.vercel.app',
    isClient: false,
    shortDesc:
      'Full-stack study companion accepting text questions, textbook problem images, and voice input via OpenAI and Groq Vision APIs.',
    fullDesc:
      'Engineered a MERN-stack academic assistant designed around multimodal accessibility. Students can type queries, speak naturally, or upload textbook diagrams to receive step-by-step explanations with persistent MongoDB chat history.',
    humanImpact: 'Supports text, image, and voice input so students learn in whichever modality suits them best.',
    metrics: ['Text · Image · Voice', 'MERN + Vision'],
    highlights: [
      'Multimodal input pipeline (text, textbook photos, and voice)',
      'Fast streaming responses via OpenAI & Groq Vision models',
      'Full MERN backend storing persistent study threads',
    ],
    tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'OpenAI / Groq'],
    accentTone: 'mineral',
    githubUrl: 'https://github.com/hashirahmad806/Web_Projectect_Ai_Assistant',
    liveUrl: 'https://web-projectect-ai-assistant-x8xz.vercel.app/',
    featured: false,
    lensTelemetry: {
      architecture: 'MERN Client + Multimodal Inference Gateway',
      latencyOrOutcome: 'Sub-second streaming vision & Q&A workflow',
      stackFocus: 'React · Node.js · Vision APIs',
    },
  },
  {
    id: 'commit-roulette',
    title: 'Commit Roulette Competition UI',
    category: 'fullstack',
    tag: 'Real-Time Coding Arena',
    domain: 'github.com/hashirahmad806/commit-roulette',
    isClient: false,
    shortDesc:
      'Live-coding competition frontend featuring a dynamic category roulette, synchronized countdown clock, and PRD scoring interface in React 19 + TypeScript.',
    fullDesc:
      'Built the high-pressure live-coding arena frontend for Commit Roulette: real bugs, real deadlines, one room, one clock. Crafted with React 19, TypeScript, Vite, and Tailwind v4 for crisp state clarity under time pressure.',
    humanImpact: 'Keeps competitors and judges synchronized with zero visual clutter during live timed rounds.',
    metrics: ['React 19 + TS', 'Tailwind v4'],
    highlights: [
      'Interactive category roulette and synchronized round timer',
      'PRD rubric scoring matrix built in strict TypeScript',
      'High-contrast dark cockpit UI for timed coding events',
    ],
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4'],
    accentTone: 'copper',
    githubUrl: 'https://github.com/hashirahmad806/commit-roulette',
    liveUrl: 'https://github.com/hashirahmad806/commit-roulette',
    featured: false,
    lensTelemetry: {
      architecture: 'React 19 + TypeScript State Machine',
      latencyOrOutcome: 'Zero-flicker live competition timer & rubric UI',
      stackFocus: 'React 19 · TypeScript · Vite',
    },
  },
  {
    id: 'quick-blogs',
    title: 'QuickBlogs AI Publishing CMS',
    category: 'fullstack',
    tag: 'Full-Stack MERN CMS',
    domain: 'quick-blogs-i4xh.vercel.app',
    isClient: false,
    shortDesc:
      'Authenticated full-stack publishing platform with admin moderation, AI-assisted article drafting, and clean markdown reading typography.',
    fullDesc:
      'End-to-end MERN publishing platform featuring JWT authentication, role-based admin controls, AI-assisted content drafting inside the editor, and comment moderation workflows.',
    humanImpact: 'Reduces manual drafting friction for writers while preserving editorial review control.',
    metrics: ['JWT Auth', 'AI Drafting'],
    highlights: [
      'Role-based JWT auth & admin content moderation dashboard',
      'Integrated AI drafting assistant inside the publishing flow',
      'Clean responsive reading layout with MongoDB aggregation',
    ],
    tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    accentTone: 'jade',
    githubUrl: 'https://github.com/hashirahmad806/Quick-Blogs',
    liveUrl: 'https://quick-blogs-i4xh.vercel.app/',
    featured: false,
    lensTelemetry: {
      architecture: 'MERN REST API + Role-Based Admin CMS',
      latencyOrOutcome: 'Live deployment on Vercel with JWT security',
      stackFocus: 'MongoDB · Express · React · Node.js',
    },
  },
  {
    id: 'reelnova',
    title: 'ReelNova Movie Discovery',
    category: 'fullstack',
    tag: 'Media & Search UX',
    domain: 'reel-nova-movie.vercel.app',
    isClient: false,
    shortDesc:
      'Responsive cinema discovery app with instant debounced search, Appwrite authentication, and cross-device personal watchlists.',
    fullDesc:
      'Built a fast media discovery application powered by React, Tailwind CSS, and Appwrite. Features debounced real-time search with zero layout jitter, persistent user watchlists across devices, and curated trending analytics.',
    humanImpact: 'Delivers instant search feedback without jarring layout shifts on mobile or desktop.',
    metrics: ['Appwrite Auth', 'Instant Search'],
    highlights: [
      'Debounced live film search with skeleton loading states',
      'Appwrite authentication & synced cross-device watchlists',
      'Responsive media cards optimized for mobile thumb reach',
    ],
    tech: ['React.js', 'Tailwind CSS', 'Appwrite', 'REST API'],
    accentTone: 'mineral',
    githubUrl: 'https://github.com/hashirahmad806/ReelNova-Movie-Web',
    liveUrl: 'https://reel-nova-movie.vercel.app/',
    featured: false,
    lensTelemetry: {
      architecture: 'React SPA + Appwrite Cloud Auth & Persistence',
      latencyOrOutcome: 'Live Vercel deployment with synced watchlists',
      stackFocus: 'React · Appwrite · Debounced Search',
    },
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'wrapify',
    period: 'Nov 2025 – Jan 2026',
    role: 'Full Stack Development Intern',
    organization: 'Wrapify Solutions',
    location: '3-Month Production Internship',
    type: 'Internship',
    summary:
      'Engineered responsive component-driven UIs and server-side API logic that shipped directly to production across a 3-month engineering term.',
    points: [
      'Built responsive frontend components and server-side logic for live client web applications',
      'Integrated new features cleanly inside an established engineering codebase without regressions',
      'Collaborated with senior engineers to debug, profile, and harden client-facing reliability',
    ],
    proofAsset: {
      label: 'View Internship Certificate',
      href: '/certificates/wrapify-internship.png',
    },
  },
  {
    id: 'client-delivery',
    period: '2024 – Present',
    role: 'Freelance Full-Stack & Astro Engineer',
    organization: 'Independent Client Deliveries',
    location: 'Remote · Commercial & Healthcare',
    type: 'Commercial',
    summary:
      'Designed, built, and deployed revenue-generating web platforms from initial architecture to Vercel production.',
    points: [
      'Shipped Triostep Heritage Footwear headless Astro + WooCommerce storefront',
      'Delivered Dr. Hassan BDS clinical platform with online booking & smile makeover gallery',
      'Prioritized Core Web Vitals, SEO metadata, and mobile-first checkout/booking flows',
    ],
  },
  {
    id: 'ai-systems',
    period: '2024 – Present',
    role: 'AI Agents, RAG & Deep Learning Builder',
    organization: 'Applied Research & Open Source',
    location: 'LangGraph · Atlas Vector · PyTorch',
    type: 'Engineering',
    summary:
      'Architecting multi-agent LangGraph workflows, sub-20ms MongoDB Vector RAG pipelines, CNN vision models, and LSTM sequence predictors.',
    points: [
      'Built stateful LangGraph agent workflows with persistent memory and schema-checked tools',
      'Trained PlantVillage crop-disease CNN in TensorFlow/Keras and deployed across Web + Mobile',
      'Implemented Laptop Price Predictor regression & Next-Word LSTM sequence modeling',
    ],
  },
  {
    id: 'uet-peshawar',
    period: '2024 – 2028',
    role: 'B.S. Computer Science (CGPA 3.45 / 4.0)',
    organization: 'University of Engineering & Technology (UET), Peshawar',
    location: 'Peshawar, Pakistan',
    type: 'Academic',
    summary:
      'Strong mathematical and systems foundation spanning algorithms, software engineering, applied machine learning, and data science.',
    points: [
      'Core coursework in Data Structures, Algorithms, Databases, and Statistical Modeling',
      'Completed NAVTTC 3-month Machine Learning & Deep Learning intensive certification',
      'Applied Duke University Human Factors in AI standards directly into UI/UX architecture',
    ],
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'azure-ai',
    title: 'Microsoft Certified: Azure AI Fundamentals',
    issuer: 'Microsoft',
    platform: 'Microsoft Learn',
    date: 'Jun 2026',
    badgeCode: 'MS-AI900',
    credentialId: '6B28946001D96051',
    summary:
      'Enterprise validation in machine learning workloads, computer vision, natural language processing, and generative AI services on Microsoft Azure.',
    file: '/certificates/azure-ai-fundamentals-microsoft.pdf',
    verifyUrl: 'https://learn.microsoft.com/api/credentials/share/en-us/6B28946001D96051',
    featured: true,
  },
  {
    id: 'navttc-ml',
    title: 'Machine Learning & Deep Learning (3-Month Program)',
    issuer: 'NAVTTC',
    platform: 'National Vocational & Technical Training',
    date: '2025 – 2026',
    badgeCode: 'NAVTTC-DL',
    credentialId: 'NAVTTC-ML-DL-3M',
    summary:
      'Hands-on intensive program covering supervised learning, feature engineering, neural network architectures, PyTorch, and TensorFlow model evaluation.',
    featured: true,
  },
  {
    id: 'human-factors-duke',
    title: 'Human Factors in AI',
    issuer: 'Duke University',
    platform: 'Coursera',
    date: 'May 2026',
    badgeCode: 'DUKE-HCI',
    credentialId: 'A6X7RU2OWASD',
    summary:
      'Human-centered AI design principles: trust calibration, explainability, cognitive ergonomics, error recovery, and ethical deployment.',
    file: '/certificates/human-factors-ai-duke.pdf',
    verifyUrl: 'https://coursera.org/verify/A6X7RU2OWASD',
  },
  {
    id: 'cv-ibm',
    title: 'Computer Vision and Image Processing Essentials (V2)',
    issuer: 'IBM',
    platform: 'Coursera · Credly',
    date: 'Jul 2026',
    badgeCode: 'IBM-CV2',
    credentialId: 's1VfeIFA',
    summary:
      'Image classification, convolutional neural architectures, object detection pipelines, and OpenCV/vision preprocessing.',
    file: '/certificates/computer-vision-ibm.pdf',
    verifyUrl: 'https://www.credly.com/go/s1VfeIFA',
  },
  {
    id: 'ai-google',
    title: 'AI Fundamentals',
    issuer: 'Google',
    platform: 'Coursera',
    date: 'Jul 2026',
    badgeCode: 'GOOG-AI',
    credentialId: 'SAVTLW9G2TGH',
    summary:
      'Core AI systems thinking, responsible prompt engineering, productivity workflows, and practical LLM integration.',
    file: '/certificates/ai-fundamentals-google.pdf',
    verifyUrl: 'https://coursera.org/verify/SAVTLW9G2TGH',
  },
  {
    id: 'data-jhu',
    title: 'Managing Data Analysis',
    issuer: 'Johns Hopkins University',
    platform: 'Coursera',
    date: 'Jul 2026',
    badgeCode: 'JHU-DA',
    credentialId: 'XV2YZI5FJ0L8',
    summary:
      'Experimental rigor, statistical interpretation, reproducible analysis workflows, and engineering team decision-making.',
    file: '/certificates/data-analysis-jhu.pdf',
    verifyUrl: 'https://coursera.org/verify/XV2YZI5FJ0L8',
  },
  {
    id: 'cyber-ibm',
    title: 'Introduction to Cybersecurity Essentials',
    issuer: 'IBM',
    platform: 'Coursera',
    date: 'May 2026',
    badgeCode: 'IBM-SEC',
    credentialId: '6GG25VAU3KR1',
    summary:
      'Security fundamentals, authentication boundaries, threat modeling, and defensive practices for modern cloud applications.',
    file: '/certificates/cybersecurity-ibm.pdf',
    verifyUrl: 'https://coursera.org/verify/6GG25VAU3KR1',
  },
  {
    id: 'react-bi',
    title: 'Frontend Development using React',
    issuer: 'Board Infinity',
    platform: 'Coursera',
    date: 'May 2026',
    badgeCode: 'BI-REACT',
    credentialId: 'X0XEEKDUFCA8',
    summary:
      'Component architecture, hooks, state management, responsive styling, and modern frontend production workflows.',
    file: '/certificates/frontend-react-board-infinity.pdf',
    verifyUrl: 'https://coursera.org/verify/X0XEEKDUFCA8',
  },
];

export const SKILL_NODES: SkillNode[] = [
  {
    id: 'langgraph',
    name: 'LangChain & LangGraph',
    category: 'ai',
    tag: 'Cyclic State Graphs',
    maturity: 'Production',
    latency: '34ms',
    tenure: '2+ Years',
    role: 'Multi-agent cyclic state machines with checkpoint memory, conditional edges, human-in-the-loop pauses, and schema-verified tool routing.',
    language: 'Python 3.11',
    code: `graph = StateGraph(AgentState)
graph.add_node("reason", call_model)
graph.add_node("tools", run_verified_tools)
graph.add_conditional_edges("reason", route_next)
app = graph.compile(checkpointer=memory)`,
    projectLink: 'AI Codebase Memory Graph',
  },
  {
    id: 'vector',
    name: 'Atlas Vector Search (RAG)',
    category: 'ai',
    tag: 'Cosine ANN Indexing',
    maturity: 'Enterprise',
    latency: '18ms',
    tenure: '2+ Years',
    role: 'Hierarchical document chunking, dense embeddings, and sub-20ms approximate nearest neighbor vector search grounded by source citations.',
    language: 'MongoDB Atlas / Python',
    code: `pipeline = [{
  "$vectorSearch": {
    "index": "knowledge_cosine_v2",
    "path": "embedding",
    "queryVector": query_vec,
    "numCandidates": 100,
    "limit": 5
  }
}]`,
    projectLink: 'Production RAG Pipeline',
  },
  {
    id: 'vision-ml',
    name: 'TensorFlow & PyTorch ML',
    category: 'ai',
    tag: 'CNN & LSTM Models',
    maturity: 'Applied ML',
    latency: '22ms',
    tenure: '2+ Years',
    role: 'Convolutional image classification (PlantVillage CNN), LSTM sequence prediction, and tabular regression models deployed cleanly behind APIs.',
    language: 'Python · Keras · PyTorch',
    code: `model = keras.Sequential([
  layers.Rescaling(1./255),
  layers.Conv2D(32, 3, activation="relu"),
  layers.MaxPooling2D(),
  layers.GlobalAveragePooling2D(),
  layers.Dense(num_classes, activation="softmax")
])`,
    projectLink: 'PlantVillage Crop Pathology CNN',
  },
  {
    id: 'astro',
    name: 'Astro & High-SEO Architecture',
    category: 'frontend',
    tag: 'Zero-Bloat Islands',
    maturity: 'Production',
    latency: '0ms JS idle',
    tenure: '2+ Years',
    role: 'Static-first semantic HTML delivery, JSON-LD schema graphs, asset optimization, and selective client hydration with GSAP optical choreography.',
    language: 'Astro · TypeScript · CSS',
    code: `// astro.config.mjs
export default defineConfig({
  site: "https://my-portfolios-sandy.vercel.app",
  compressHTML: true,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] }
});`,
    projectLink: 'Triostep Headless Store',
  },
  {
    id: 'react',
    name: 'React 19 & TypeScript UI',
    category: 'frontend',
    tag: 'Accessible Systems',
    maturity: 'Expert',
    latency: '60/120fps',
    tenure: '3+ Years',
    role: 'Strict TypeScript UI systems, WCAG AA/AAA focus management, Tailwind CSS v4 tokens, and tactile motion calibrated for human perception.',
    language: 'React 19 · TypeScript',
    code: `const focusTrap = (modal: HTMLElement) => {
  const stops = modal.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input, textarea'
  );
  stops[0]?.focus();
};`,
    projectLink: 'Commit Roulette & Dr. Hassan Clinic',
  },
  {
    id: 'node-mongo',
    name: 'Node.js, Express & MongoDB',
    category: 'backend',
    tag: 'MERN & Cloud APIs',
    maturity: 'Production',
    latency: '14ms',
    tenure: '3+ Years',
    role: 'Modular RESTful APIs with JWT auth, bcrypt hashing, rate-limiting middleware, Mongoose aggregation pipelines, and cloud deployments.',
    language: 'Node.js · Express · MongoDB',
    code: `router.post("/v1/inquiry", rateLimiter, validateBody, async (req, res) => {
  const saved = await Inquiry.create(req.sanitized);
  return res.status(201).json({ ok: true, id: saved._id });
});`,
    projectLink: 'QuickBlogs & Lumina Assistant',
  },
];

export const AGENT_LOOP_STEPS = [
  {
    step: '01',
    name: 'Perceive & Parse Intent',
    role: 'Human-Centered Input',
    desc: 'Decodes natural-language goals, validates inputs against strict schemas, and restores persistent thread context.',
    tech: 'LangGraph MemorySaver',
    metric: '4.2ms parse',
  },
  {
    step: '02',
    name: 'Vector Retrieval',
    role: 'Factual Grounding',
    desc: 'Queries MongoDB Atlas Cosine ANN index to fetch top-k verified documents before reasoning begins.',
    tech: 'Atlas Vector Search',
    metric: '18.4ms ANN recall',
  },
  {
    step: '03',
    name: 'Plan & Conditional Route',
    role: 'ReAct Decision Node',
    desc: 'Weighs retrieved context against available tools; branches cleanly between database lookup, computation, or synthesis.',
    tech: 'LangGraph State Router',
    metric: 'Typed edge transitions',
  },
  {
    step: '04',
    name: 'Verified Tool Execution',
    role: 'Bounded Action',
    desc: 'Invokes external APIs and database queries with strict validation and automatic retry fallback on transient errors.',
    tech: 'Schema-Checked Tools',
    metric: '100% typed boundaries',
  },
  {
    step: '05',
    name: 'Reflect & Humanize Output',
    role: 'Trust Calibration',
    desc: 'Cross-checks claims against retrieved sources, attaches citations, and formats clear human-readable responses.',
    tech: 'Self-Reflection Edge',
    metric: 'Source-cited output',
  },
];
