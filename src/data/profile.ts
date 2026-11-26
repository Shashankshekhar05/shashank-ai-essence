export const profile = {
  name: "Shashank Shekhar",
  position: "AI Engineer · Generative AI & LLM Applications",
  heroHeadline: "AI Engineer building intelligent products with Generative AI.",
  heroSupport: ["Production AI", "RAG", "LLMs", "Voice AI", "Backend Systems"],
  location: "Chandigarh, India · Remote-ready",
  availability: "Open to AI engineering roles in India and globally",
  email: "radiant.shashankshekhar@gmail.com",
  github: "https://github.com/Shashankshekhar05",
  linkedin: "https://www.linkedin.com/in/shashankshekhar05/",
  about: `I'm Shashank Shekhar, an AI Engineer focused on building practical Generative AI systems and production-ready backend applications. I started with software engineering and backend development, working with Java, Spring Boot, Python, and FastAPI, and gradually moved deeper into Generative AI, LLMs, RAG, and agentic systems.

Today, I work as an AI Associate Software Engineer at Socomo Technologies, where I build and integrate AI-powered systems. My work includes production voice AI infrastructure, telephony integrations, AI agent workflows, CRM integrations, and backend services.

Outside of my professional work, I build AI products that solve specific problems — such as a RAG-powered Constitutional Law learning assistant designed to help students understand, explore, and learn from constitutional content.

My goal is to become an AI Engineer who can take an AI idea from architecture to a reliable, production-ready product.`,
};

export const credibility = [
  { label: "Current", value: "AI Associate Software Engineer", note: "Socomo Technologies / JungleWorks" },
  { label: "Focus", value: "Voice AI & Agentic Systems", note: "Production telephony + LLM orchestration" },
  { label: "Education", value: "B.Tech CSE, 2026", note: "Chandigarh Engineering College" },
  { label: "Certified", value: "Oracle OCI AI Foundations", note: "2025 Associate" },
];

export const experience = [
  {
    role: "AI Associate Software Engineer (AI Engineer Intern)",
    company: "Socomo Technologies Pvt. Ltd. / JungleWorks",
    period: "Feb 2026 — Present",
    place: "Chandigarh, India",
    summary:
      "Building and integrating production AI systems: multi-tenant voice AI infrastructure, telephony providers, AI agent workflows, CRM integrations, and backend services.",
    points: [
      "Backend for a multi-tenant AI voice dialer and AI sales trainer using Python 3, FastAPI, SQLAlchemy 2 and Pydantic 2.",
      "Human call transfer and hunt-group routing with warm whisper and cold bridge modes.",
      "AI-agent-to-agent transfer with live re-stream and call-id swap.",
      "Bolna provider integration with retries, webhooks and BYOK, normalized into a shared CallRecord pipeline.",
      "Zoho CRM OAuth2 bidirectional lead sync with post-call notes.",
      "HubSpot OAuth2 CRM v3 contact sync, post-call notes and webhooks.",
    ],
    stack: ["Python 3", "FastAPI", "SQLAlchemy 2", "Pydantic 2", "PostgreSQL", "Redis", "Twilio", "Plivo", "Ultravox", "Bolna", "Celery", "APScheduler", "AWS S3"],
  },
  {
    role: "Java Developer Trainee",
    company: "ThinkNext Technologies",
    period: "Dec 2024 — Jan 2025 · 6 weeks",
    place: "Training program",
    summary:
      "Backend training program focused on Java and Spring Boot fundamentals: REST APIs, debugging and unit testing.",
    points: [
      "Built REST APIs with Java and Spring Boot backed by MySQL.",
      "Practiced systematic debugging and unit testing workflows.",
    ],
    stack: ["Java", "Spring Boot", "MySQL", "REST APIs"],
  },
];

export const secondaryProjects = [
  {
    name: "Finance Dashboard REST API",
    blurb: "Authenticated finance dashboard API with role-based access control.",
    stack: ["FastAPI", "PostgreSQL", "JWT", "RBAC"],
    href: "https://github.com/Shashankshekhar05/zorvyn_Assignment",
  },
  {
    name: "AI Support Ticket System",
    blurb: "Retrieval-augmented ticket triage and response drafting.",
    stack: ["Python", "RAG", "Claude API"],
    href: "https://github.com/Shashankshekhar05/ai-support-ticket-system",
  },
  {
    name: "Enterprise Expense Management",
    blurb: "Spring Boot backend for expense submission, approval and reporting.",
    stack: ["Java", "Spring Boot", "MySQL"],
    href: "https://github.com/Shashankshekhar05/backend-expense-management",
  },
];

export const skillGroups = [
  { title: "Languages", items: ["Python", "Java", "JavaScript", "SQL"] },
  {
    title: "Generative AI",
    items: ["LLMs", "RAG", "LangGraph", "Prompt engineering", "Vector search", "Embeddings", "Function calling", "Conversational AI", "AI system design"],
  },
  {
    title: "Backend",
    items: ["FastAPI", "Spring Boot", "REST APIs", "OAuth2", "JWT", "Webhooks", "Microservices", "Multithreading"],
  },
  { title: "Data", items: ["PostgreSQL", "MySQL", "Redis", "Vector databases"] },
  {
    title: "Voice & Telephony",
    items: ["Ultravox", "Bolna", "Twilio", "Plivo", "WebSockets", "STT / TTS", "Agent orchestration"],
  },
  { title: "Cloud & Tooling", items: ["AWS S3", "Docker", "Git / GitHub", "OCI AI Services"] },
  { title: "CRM Platforms", items: ["Zoho", "HubSpot", "GoHighLevel"] },
  { title: "AI Dev Tools", items: ["Claude Code", "Cursor", "OpenAI Codex", "Google Antigravity"] },
];

export const credentials = [
  {
    name: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    kind: "Certification",
  },
  { name: "Introduction to Generative AI", issuer: "Course completion", kind: "Course completion" },
  { name: "Claude 101", issuer: "Anthropic", kind: "Course completion" },
  { name: "Introduction to Agent Skills", issuer: "Anthropic", kind: "Course completion" },
  { name: "Claude Code in Action", issuer: "Anthropic", kind: "Course completion" },
  { name: "AI Fluency for Educators", issuer: "Anthropic", kind: "Course completion" },
  { name: "C# and .NET Essential Training", issuer: "LinkedIn Learning", kind: "Course completion" },
];

export const sections = [
  { id: "work", label: "Work" },
  { id: "voice-ai", label: "Voice AI" },
  { id: "constitution", label: "Legal AI" },
  { id: "ai-judgment", label: "AI Practice" },
  { id: "engineering", label: "Engineering" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Credentials" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
