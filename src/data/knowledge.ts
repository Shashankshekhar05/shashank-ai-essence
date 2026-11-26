/**
 * Curated, editable knowledge base for the portfolio assistant.
 * Source of truth: the public portfolio content in src/data/profile.ts.
 * Keep this file free of UI concerns so it can be updated independently.
 */

import { newProjectKnowledge } from "./new-projects";

export type KnowledgeSection = {
  title: string;
  content: string;
};

export const knowledgeSections: KnowledgeSection[] = [
  {
    title: "Identity & positioning",
    content: `Shashank Shekhar is an AI Engineer focused on Generative AI, LLM applications, RAG systems, voice AI and production-ready backend systems. Based in Chandigarh, India; remote-ready and open to AI engineering roles in India and globally. Contact email: radiant.shashankshekhar@gmail.com. GitHub: https://github.com/Shashankshekhar05. LinkedIn: https://www.linkedin.com/in/shashankshekhar05/. Education: B.Tech Computer Science & Engineering, Chandigarh Engineering College, graduating 2026.`,
  },
  {
    title: "Current role",
    content: `AI Associate Software Engineer (AI Engineer Intern) at Socomo Technologies Pvt. Ltd. / JungleWorks, Chandigarh, India, since February 2026. He builds and integrates production AI systems: multi-tenant voice AI infrastructure, telephony provider integrations, AI agent workflows, CRM integrations and backend services.`,
  },
  {
    title: "AI voice / dialer platform (professional work)",
    content: `Backend for a multi-tenant AI voice dialer and AI sales trainer. Stack: Python 3, FastAPI, SQLAlchemy 2, Pydantic 2, PostgreSQL, Redis, AWS S3, Celery, APScheduler, asyncio. Telephony and voice agents: Twilio, Plivo, Ultravox, Bolna. Features: human call transfer and hunt-group routing with warm-whisper and cold-bridge modes; AI-agent-to-agent transfer with live re-stream and call-id swap; Bolna provider integration with retries, webhooks and BYOK normalized into a shared CallRecord pipeline; Zoho CRM OAuth2 bidirectional lead sync with post-call notes; HubSpot OAuth2 CRM v3 contact sync with post-call notes and webhooks. Engineering decisions: provider abstraction so telephony/voice vendors can be swapped, idempotent webhook handling, tool-based AI control with server-side validation, and a layered Route → Controller → Service → Database architecture. Auth uses JWT and API keys, with BYOK for tenant-supplied provider credentials. No performance metrics or customer numbers are public.`,
  },
  {
    title: "Constitutional Law AI Learning Assistant (personal project)",
    content: `A RAG-powered learning assistant for Indian constitutional content. Stack: Python, FastAPI, LangChain, Hugging Face (embeddings), a vector store for similarity search, and the Grok API as the LLM/generation layer. Retrieval-augmented generation combines local embeddings with vector search to retrieve relevant provisions before the LLM answers. Capabilities: constitutional Q&A, provision retrieval, plain-language explanations, source citations and references, conversation history, follow-up questions, quiz/learning mode and summarization. It is an educational tool only — it does not provide legal advice, and the assistant must never give legal advice when discussing it.`,
  },
  {
    title: "Other projects",
    content: `Enterprise Expense Management — expense submission, approval and reporting backend built with Java, Spring Boot and MySQL (https://github.com/Shashankshekhar05/backend-expense-management). Finance Dashboard REST API — authenticated finance dashboard API with role-based access control using FastAPI, PostgreSQL, JWT and RBAC (https://github.com/Shashankshekhar05/zorvyn_Assignment). AI Support Ticket System — retrieval-augmented ticket triage and response drafting with Python, RAG and the Claude API (https://github.com/Shashankshekhar05/ai-support-ticket-system).`,
  },
  ...newProjectKnowledge,
  {
    title: "Earlier experience",
    content: `Java Developer Trainee at ThinkNext Technologies, December 2024 – January 2025 (a six-week training program). Built REST APIs with Java and Spring Boot backed by MySQL, and practiced systematic debugging and unit testing workflows.`,
  },
  {
    title: "Skills",
    content: `Languages: Python, Java, JavaScript, SQL. Generative AI: LLMs, RAG, LangGraph, prompt engineering, vector search, embeddings, function calling, conversational AI, AI system design. Backend: FastAPI, Spring Boot, REST APIs, OAuth2, JWT, webhooks, microservices, multithreading. Data: PostgreSQL, MySQL, Redis, vector databases. Voice & telephony: Ultravox, Bolna, Twilio, Plivo, WebSockets, STT/TTS, agent orchestration. Cloud & tooling: AWS S3, Docker, Git/GitHub, OCI AI Services. CRM platforms: Zoho, HubSpot, GoHighLevel.`,
  },
  {
    title: "Credentials",
    content: `Certification: Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate (Oracle). Course completions (these are course completions, not certifications): Introduction to Generative AI; Anthropic Claude 101; Anthropic Introduction to Agent Skills; Anthropic Claude Code in Action; Anthropic AI Fluency for Educators; LinkedIn Learning C# and .NET Essential Training.`,
  },
  {
    title: "AI-assisted development practice",
    content: `Tools he works with for AI-assisted development: Claude Code, OpenAI Codex, OpenCode, Lovable and Cursor. These tools accelerate implementation; Shashank owns architecture, validation, security review, constraints and the decision about what ships. He does not claim to have personally hand-written every generated line of code, and no proficiency level or usage frequency is claimed.`,
  },
  {
    title: 'Case study: "Engineering with AI, Not Around It"',
    content: `A review-practice case study, not a security incident. While fixing a bug with Claude Code, the first confident plan looked questionable, so he asked "Why this approach specifically?" and challenged whether the approach could introduce a security flaw. The assistant acknowledged the concern, re-evaluated, asked for constraints and rebuilt the solution. His working loop: treat the first answer as a draft, ask why the approach was chosen, challenge assumptions, run a risk/security check, state constraints, then re-evaluate before merging. Lesson: AI does not replace engineering judgment. No vulnerability was shipped; there was no breach, exploit, CVE or customer impact.`,
  },
  {
    title: "Hiring & contact",
    content: `He is open to AI engineering roles in India and globally, and is remote-ready. The best way to reach him is email: radiant.shashankshekhar@gmail.com. GitHub and LinkedIn links are in the portfolio footer.`,
  },
];

export const knowledgeBaseText = knowledgeSections
  .map((s) => `## ${s.title}\n${s.content}`)
  .join("\n\n");

export const suggestedPrompts = [
  "What does Shashank build?",
  "Tell me about his AI Voice project.",
  "What is his experience with RAG and LLMs?",
  "How does he use AI coding tools responsibly?",
  "How can I contact him?",
];
