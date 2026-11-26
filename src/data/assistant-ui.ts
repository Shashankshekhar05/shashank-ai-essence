/**
 * Conversational UI configuration for the portfolio assistant.
 * Pure data — no UI or API concerns. Keep facts aligned with src/data/knowledge.ts.
 */

import { visualProjects } from "./new-projects";

export type VisitorIntent = { label: string; prompt: string };

export const visitorIntents: VisitorIntent[] = [
  {
    label: "I’m hiring",
    prompt:
      "I'm hiring. Give me a recruiter-focused overview of Shashank's current role, production experience and core stack.",
  },
  {
    label: "I’m a developer",
    prompt:
      "I'm a developer. Explain the architecture and engineering decisions behind Shashank's AI voice platform.",
  },
  {
    label: "Collaboration",
    prompt:
      "I'm interested in collaborating. What kinds of AI projects does Shashank work on, and how do I reach him?",
  },
  {
    label: "Just exploring",
    prompt: "What does Shashank build?",
  },
];

export const recruiterSummaryAction = {
  label: "Recruiter Summary",
  prompt:
    "Give me a 30-second recruiter summary of Shashank: current role, production experience, core tech stack, notable projects and contact details. Keep it concise.",
};

/** Quick actions shown in the proactive greeting bubble. */
export const greetingQuickActions: VisitorIntent[] = [
  { label: "View work & projects", prompt: "What does Shashank build?" },
  { label: "Explore tech stack", prompt: "What technologies does Shashank work with?" },
  { label: "Ask about experience", prompt: "Tell me about his AI Voice project." },
  { label: "Contact Shashank", prompt: "How can I contact him?" },
];

export type CtaKey = "resume" | "github" | "linkedin" | "email";

export type Cta = { key: CtaKey; label: string; href: string };

/**
 * Hosted resume (Google Drive). Enables the "View Resume" CTA.
 */
export const resumeUrl: string | null =
  "https://drive.google.com/file/d/15B3oooQJESvJzLdGi29rP9jkQflx74fj/view?usp=drive_link";

export const ctas: Cta[] = [
  ...(resumeUrl ? [{ key: "resume" as const, label: "View Resume", href: resumeUrl }] : []),
  { key: "github", label: "View GitHub", href: "https://github.com/Shashankshekhar05" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/shashankshekhar05/" },
  { key: "email", label: "Email Shashank", href: "mailto:radiant.shashankshekhar@gmail.com" },
];

export type ProjectCard = {
  id: string;
  name: string;
  context: string;
  tech: string[];
  focus: string;
  href: string;
  ctaLabel: string;
  match: RegExp;
};

export const projectCards: ProjectCard[] = [
  ...visualProjects.map((project): ProjectCard => ({
    id: project.id,
    name: project.name,
    context: "Personal project — README-based architecture study; no deployment claimed",
    tech: project.stack.flatMap((group) => group.items).slice(0, 8),
    focus: project.tagline,
    href: `/#${project.id}`,
    ctaLabel: "Explore case study",
    match: project.id === "tokensaver" ? /token\s?saver|RAG-System-designed/i : /ai interview pro|interview pro|Ai_Assisted_interview|proctoring/i,
  })),
  {
    id: "voice",
    name: "AI Voice Dialer & Sales Trainer",
    context: "Professional work — Socomo Technologies / JungleWorks",
    tech: ["Python", "FastAPI", "PostgreSQL", "Redis", "Twilio", "Plivo", "Ultravox", "Bolna"],
    focus:
      "Multi-tenant voice AI backend: provider abstraction, idempotent webhooks, call transfer workflows and CRM sync.",
    href: "/#voice-case-study",
    ctaLabel: "Explore case study",
  match: /(voice|dialer|telephony|twilio|plivo|ultravox|bolna|socomo|jungleworks|sales trainer)/i,
  },
  {
    id: "constitution",
    name: "Constitutional Law AI Learning Assistant",
    context: "Personal project — educational tool only, not legal advice",
    tech: ["Python", "FastAPI", "LangChain", "Hugging Face embeddings", "Vector search", "Grok API"],
    focus:
      "RAG pipeline that retrieves relevant provisions before generation, with citations, quiz mode and summarization.",
    href: "/#constitution-case-study",
    ctaLabel: "Explore case study",
    match: /(constitution|constitutional|law assistant|rag learning)/i,
  },
  {
    id: "ai-judgment",
    name: "Engineering with AI, Not Around It",
    context: "Case study — AI-assisted development review practice",
    tech: ["Claude Code", "OpenAI Codex", "OpenCode", "Lovable", "Cursor"],
    focus:
      "Treating the first AI answer as a draft: question assumptions, run a risk check, state constraints, then re-evaluate before merging.",
    href: "/#ai-judgment",
    ctaLabel: "Explore case study",
    match: /(ai coding|ai tool|claude code|cursor|codex|copilot|ai-assisted|judgment|review loop)/i,
  },
  {
    id: "expense",
    name: "Enterprise Expense Management",
    context: "Personal project — backend service",
    tech: ["Java", "Spring Boot", "MySQL"],
    focus: "Expense submission, approval and reporting workflows.",
    href: "https://github.com/Shashankshekhar05/backend-expense-management",
    ctaLabel: "Explore project",
    match: /(expense)/i,
  },
  {
    id: "finance",
    name: "Finance Dashboard REST API",
    context: "Personal project — authenticated API",
    tech: ["FastAPI", "PostgreSQL", "JWT", "RBAC"],
    focus: "Role-based access control over finance dashboard endpoints.",
    href: "https://github.com/Shashankshekhar05/zorvyn_Assignment",
    ctaLabel: "Explore project",
    match: /(finance dashboard|zorvyn|rbac)/i,
  },
  {
    id: "tickets",
    name: "AI Support Ticket System",
    context: "Personal project — RAG application",
    tech: ["Python", "RAG", "Claude API"],
    focus: "Retrieval-augmented ticket triage and response drafting.",
    href: "https://github.com/Shashankshekhar05/ai-support-ticket-system",
    ctaLabel: "Explore project",
    match: /(support ticket|ticket system|triage)/i,
  },
];

type FollowUpRule = { match: RegExp; questions: string[] };

const followUpRules: FollowUpRule[] = [
  {
    match: /token\s?saver|RAG-System-designed/i,
    questions: ["How do TokenSaver’s cache hits bypass generation?", "What happens when Grok is unavailable in TokenSaver?", "Which parts of TokenSaver run locally?"],
  },
  {
    match: /ai interview pro|interview pro|proctoring|Ai_Assisted_interview/i,
    questions: ["How does AI Interview Pro’s voice interview work?", "Where does its proctoring vision inference run?", "Who makes the final hiring decision?"],
  },
  {
    match: /(voice|dialer|telephony|twilio|plivo|ultravox|bolna|socomo|jungleworks)/i,
    questions: [
      "What technologies did he use in it?",
      "How does the call transfer flow work?",
      "Which CRM integrations does it support?",
    ],
  },
  {
    match: /(rag|retrieval|embedding|vector|langchain|llm)/i,
    questions: [
      "Which RAG projects has he built?",
      "How does the Constitutional Law assistant work?",
      "What LLM providers has he worked with?",
    ],
  },
  {
    match: /(claude code|cursor|codex|ai-assisted|ai coding|lovable)/i,
    questions: [
      "How does he review AI-generated code?",
      "What is the “Engineering with AI” case study about?",
      "Which AI dev tools does he work with?",
    ],
  },
  {
    match: /(certif|credential|course|oracle|oci)/i,
    questions: [
      "Which certification does he hold?",
      "What is his educational background?",
      "What are his core skills?",
    ],
  },
  {
    match: /(hire|hiring|role|contact|email|remote|available|opportunit)/i,
    questions: [
      "What kind of roles is he looking for?",
      "Is he open to remote work?",
      "Give me a 30-second recruiter summary.",
    ],
  },
  {
    match: /(project|build|portfolio|work)/i,
    questions: [
      "Tell me about his AI Voice project.",
      "What technologies does he work with?",
      "How can I contact him?",
    ],
  },
  {
    match: /(stack|technolog|skill|python|fastapi|java|postgres|redis)/i,
    questions: [
      "Where has he used this stack in production?",
      "What backend architecture does he follow?",
      "Tell me about his AI Voice project.",
    ],
  },
];

const defaultFollowUps = [
  "What does Shashank build?",
  "Tell me about his AI Voice project.",
  "How can I contact him?",
];

/** Pick 2–3 relevant follow-up questions from the last exchange. */
export function getFollowUps(userText: string, answerText: string): string[] {
  const haystack = `${userText}\n${answerText}`;
  const picked: string[] = [];
  for (const rule of followUpRules) {
    if (!rule.match.test(haystack)) continue;
    for (const q of rule.questions) {
      if (picked.length < 3 && !picked.includes(q) && !isSameQuestion(q, userText)) picked.push(q);
    }
    if (picked.length >= 3) break;
  }
  if (picked.length < 2) {
    for (const q of defaultFollowUps) {
      if (picked.length < 3 && !picked.includes(q) && !isSameQuestion(q, userText)) picked.push(q);
    }
  }
  return picked.slice(0, 3);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isSameQuestion(a: string, b: string) {
  return normalize(a) === normalize(b);
}

/** Show a project card only when the exchange is clearly about one project. */
export function matchProjectCard(userText: string, answerText: string): ProjectCard | null {
  const matches = projectCards.filter(
    (p) => p.match.test(userText) || p.match.test(answerText),
  );
  return matches.length === 1 ? matches[0] ?? null : null;
}

const contactCtaPattern =
  /\b(contact|contacted|email|reach out|get in touch|hire|hiring|resume|cv|linkedin|github|opportunity|opportunities|recruiter|recruiting|remote-ready|available for)\b/i;

/** Contact CTAs appear only when the visitor asks about hiring or getting in touch. */
export function shouldShowCtas(userText: string, answerText: string): boolean {
  return contactCtaPattern.test(userText) || contactCtaPattern.test(answerText);
}
