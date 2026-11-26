// Technical deep-dive content for every project card.
// Derived only from existing portfolio content (profile.ts / knowledge.ts / case studies).
// Never add metrics here — use MEASURE placeholders until real values exist.

export const MEASURE = "Add measured value";

export type Stage = {
  id: string;
  label: string;
  tech: string[];
  input: string;
  process: string;
  output: string;
};

export type WalkStep = { stage: string; text: string };

export type DeepDive = {
  id: string;
  title: string;
  context: string;
  summary: string;
  sample: string;
  stages: Stage[];
  walkthrough: WalkStep[];
  decisions: string[];
  limitations: string[];
  metrics: { label: string; value: string }[];
};

export const deepDives: Record<string, DeepDive> = {
  voice: {
    id: "voice",
    title: "Multi-tenant AI Voice Dialer & AI Sales Trainer",
    context: "Production backend · Socomo Technologies / JungleWorks",
    summary:
      "Telephony providers and realtime voice agents orchestrated by a layered FastAPI backend, with human/agent transfers and CRM sync on a normalized CallRecord.",
    sample: "An outbound campaign call to a lead that needs a warm transfer to a human.",
    stages: [
      { id: "lead", label: "Lead / Call", tech: ["Inbound", "Outbound campaign"], input: "Lead record or incoming call", process: "Campaign or inbound route selects tenant and agent config", output: "Call request" },
      { id: "tel", label: "Telephony", tech: ["Twilio", "Plivo"], input: "Call request", process: "Provider places / receives the call and streams media", output: "Live audio stream + provider webhooks" },
      { id: "agent", label: "Voice agent", tech: ["Ultravox", "Bolna"], input: "Caller audio", process: "Realtime voice provider handles speech recognition, LLM turn-taking and speech synthesis", output: "Agent speech + tool calls" },
      { id: "tools", label: "Tool validation", tech: ["FastAPI", "Pydantic 2"], input: "Agent tool call (e.g. transfer)", process: "Server validates the tool call before acting — the AI never controls state directly", output: "Approved action" },
      { id: "transfer", label: "Transfer / handoff", tech: ["Warm whisper", "Cold bridge", "Agent → agent"], input: "Approved transfer", process: "Whisper context to a human, bridge via hunt group, or re-stream to a second AI agent with call-id swap", output: "Bridged call" },
      { id: "record", label: "CallRecord", tech: ["PostgreSQL", "Redis", "AWS S3", "Celery"], input: "Provider webhooks", process: "Idempotent webhook handling with retries; normalized into one shared CallRecord", output: "Persisted call, state and recordings" },
      { id: "crm", label: "CRM sync", tech: ["Zoho", "HubSpot", "GoHighLevel", "OAuth2"], input: "Completed CallRecord", process: "Lead / contact sync and post-call notes", output: "Updated CRM record" },
    ],
    walkthrough: [
      { stage: "lead", text: "A campaign picks a lead and the tenant's agent configuration." },
      { stage: "tel", text: "Twilio or Plivo dials out; media is streamed to the voice provider." },
      { stage: "agent", text: "Ultravox or Bolna runs the conversation in realtime." },
      { stage: "tools", text: "The agent requests a transfer; the backend validates it server-side." },
      { stage: "transfer", text: "Warm whisper: the human hears context privately, then the lead is bridged in." },
      { stage: "record", text: "Provider webhooks are processed idempotently into the shared CallRecord." },
      { stage: "crm", text: "Notes and lead status sync back to Zoho or HubSpot." },
    ],
    decisions: [
      "Provider abstraction: Twilio/Plivo and Ultravox/Bolna sit behind shared interfaces.",
      "Idempotent webhooks with async retry, so duplicate provider events are safe.",
      "Tool-based AI control with server validation instead of trusting model output.",
      "Layered Route → Controller → Service → Database architecture; BYOK and JWT / API-key auth.",
    ],
    limitations: [
      "No public performance metrics are shared for this production system.",
      "Company-internal details (customers, volumes) are intentionally omitted.",
    ],
    metrics: [
      { label: "Transfer latency", value: MEASURE },
      { label: "Webhook retry success", value: MEASURE },
    ],
  },
  constitution: {
    id: "constitution",
    title: "Constitutional Law AI Learning Assistant",
    context: "Personal product · RAG · educational only, not legal advice",
    summary:
      "A retrieval-augmented study assistant: questions are grounded in constitutional content and answered with citations, plus provision lookup and a quiz mode.",
    sample: "A student asks what a specific constitutional provision means.",
    stages: [
      { id: "content", label: "Constitutional content", tech: ["Source text"], input: "Constitutional provisions", process: "Content is prepared for indexing", output: "Indexed passages" },
      { id: "embed", label: "Embeddings", tech: ["Hugging Face"], input: "Passages / question", process: "Text is converted into embedding vectors", output: "Vectors" },
      { id: "store", label: "Vector store", tech: ["Vector search", "LangChain"], input: "Query vector", process: "Similarity search over indexed passages", output: "Top matching passages" },
      { id: "context", label: "Context assembly", tech: ["LangChain"], input: "Retrieved passages", process: "Passages and citations are assembled into a grounded prompt", output: "Grounded prompt" },
      { id: "llm", label: "LLM generation", tech: ["Grok API"], input: "Grounded prompt", process: "Generates a plain-language explanation from the retrieved context", output: "Draft answer" },
      { id: "answer", label: "Answer + sources", tech: ["FastAPI"], input: "Draft answer", process: "Returned with citations; quiz mode reuses the same grounding", output: "Explained answer with sources" },
    ],
    walkthrough: [
      { stage: "content", text: "Constitutional content has already been indexed." },
      { stage: "embed", text: "The student's question is embedded with a Hugging Face model." },
      { stage: "store", text: "Vector search returns the most relevant provisions." },
      { stage: "context", text: "Those passages become the only context the model sees." },
      { stage: "llm", text: "The Grok API generates a plain-language explanation." },
      { stage: "answer", text: "The answer is shown with citations — educational, never legal advice." },
    ],
    decisions: [
      "Grounding with retrieval so answers cite provisions rather than relying on model memory.",
      "Embeddings / vector search kept separate from the generation API.",
      "Explicit educational framing; no legal advice.",
    ],
    limitations: [
      "Retrieval quality has not been publicly benchmarked.",
      "Answers depend on the indexed content and can be incomplete.",
    ],
    metrics: [
      { label: "Retrieval precision", value: MEASURE },
      { label: "Answer latency", value: MEASURE },
    ],
  },
  "ai-judgment": {
    id: "ai-judgment",
    title: "Engineering with AI, Not Around It",
    context: "Engineering practice · Claude Code review experience",
    summary:
      "A near-miss review: a confident first AI plan was questioned, re-evaluated against a possible security concern and explicit constraints, then rebuilt. No vulnerability was shipped.",
    sample: "Asking Claude Code to fix a bug.",
    stages: [
      { id: "prompt", label: "Prompt", tech: ["Claude Code"], input: "Bug report", process: "Task handed to the AI assistant", output: "Request" },
      { id: "proposal", label: "AI proposal", tech: ["Claude Code"], input: "Request", process: "Clean, confident first plan", output: "Proposed fix" },
      { id: "question", label: "Question assumptions", tech: ["Human review"], input: "Proposed fix", process: "\u201CWhy this approach specifically?\u201D", output: "Open concern" },
      { id: "risk", label: "Risk check", tech: ["Threat modelling"], input: "Open concern", process: "Could this introduce a security flaw?", output: "Re-evaluation" },
      { id: "constraints", label: "Constraints", tech: ["Constraints-first"], input: "Re-evaluation", process: "AI asks for constraints; they are stated explicitly", output: "Bounded problem" },
      { id: "revised", label: "Revised solution", tech: ["Claude Code"], input: "Bounded problem", process: "Solution rebuilt against the constraints", output: "Revised fix" },
      { id: "validate", label: "Human validation", tech: ["Code review"], input: "Revised fix", process: "Shashank validates before merge", output: "Merge decision" },
    ],
    walkthrough: [
      { stage: "prompt", text: "A bug-fix task is given to Claude Code." },
      { stage: "proposal", text: "The first plan looks clean and confident — but feels questionable." },
      { stage: "question", text: "\u201CWhy this approach specifically?\u201D" },
      { stage: "risk", text: "Challenge: could it introduce a security flaw?" },
      { stage: "constraints", text: "\u201CYou're right. Let me re-evaluate.\u201D — constraints are requested." },
      { stage: "revised", text: "The solution is rebuilt against those constraints." },
      { stage: "validate", text: "Human validation decides what ships." },
    ],
    decisions: [
      "Treat AI output as a proposal, not a decision.",
      "Ask for the reasoning behind an approach before accepting it.",
      "State constraints explicitly; the human owns security and what ships.",
    ],
    limitations: ["Abstract by design: no code, CVE or incident is described."],
    metrics: [],
  },
  finance: {
    id: "finance",
    title: "Finance Dashboard REST API",
    context: "Project · FastAPI backend",
    summary: "An authenticated finance dashboard API with role-based access control on PostgreSQL.",
    sample: "A signed-in user requests dashboard data.",
    stages: [
      { id: "client", label: "Client request", tech: ["REST"], input: "HTTP request + token", process: "Dashboard client calls an endpoint", output: "Request" },
      { id: "auth", label: "JWT auth", tech: ["JWT"], input: "Bearer token", process: "Token verified to identify the user", output: "Authenticated user" },
      { id: "rbac", label: "RBAC check", tech: ["RBAC"], input: "User role", process: "Role permitted for this endpoint?", output: "Allow / deny" },
      { id: "api", label: "FastAPI handler", tech: ["FastAPI"], input: "Authorized request", process: "Validates input and runs the query", output: "Query" },
      { id: "db", label: "PostgreSQL", tech: ["PostgreSQL"], input: "Query", process: "Reads / writes finance records", output: "Rows" },
      { id: "resp", label: "JSON response", tech: ["REST"], input: "Rows", process: "Serialized response", output: "Dashboard data" },
    ],
    walkthrough: [
      { stage: "client", text: "The client sends a request with a JWT." },
      { stage: "auth", text: "The token is verified." },
      { stage: "rbac", text: "The user's role is checked against the endpoint." },
      { stage: "api", text: "FastAPI validates and handles the request." },
      { stage: "db", text: "PostgreSQL returns the records." },
      { stage: "resp", text: "JSON is returned to the dashboard." },
    ],
    decisions: ["Authentication (JWT) separated from authorization (RBAC)."],
    limitations: ["Project description does not include an AI query router; none is shown."],
    metrics: [{ label: "p95 latency", value: MEASURE }],
  },
  tickets: {
    id: "tickets",
    title: "AI Support Ticket System",
    context: "Project · Python · RAG",
    summary: "Retrieval-augmented ticket triage and response drafting with the Claude API.",
    sample: "A new support ticket arrives.",
    stages: [
      { id: "ticket", label: "Ticket", tech: ["Python"], input: "Ticket text", process: "Ticket received", output: "Query" },
      { id: "retrieve", label: "Retrieval", tech: ["RAG"], input: "Ticket query", process: "Relevant reference content retrieved", output: "Context" },
      { id: "llm", label: "Claude API", tech: ["Claude API"], input: "Ticket + context", process: "Triage and draft a response grounded in context", output: "Triage + draft" },
      { id: "out", label: "Triage & draft", tech: ["Python"], input: "Model output", process: "Returned as a categorized ticket with draft reply", output: "Draft response" },
    ],
    walkthrough: [
      { stage: "ticket", text: "A ticket comes in." },
      { stage: "retrieve", text: "Relevant content is retrieved for context." },
      { stage: "llm", text: "Claude triages it and drafts a reply from that context." },
      { stage: "out", text: "A triaged ticket and draft response are produced." },
    ],
    decisions: ["Retrieval grounds drafts instead of free-form generation."],
    limitations: ["Triage accuracy has not been measured publicly."],
    metrics: [{ label: "Triage accuracy", value: MEASURE }],
  },
  expense: {
    id: "expense",
    title: "Enterprise Expense Management",
    context: "Project · Java / Spring Boot backend",
    summary: "Spring Boot backend for expense submission, approval and reporting on MySQL.",
    sample: "An employee submits an expense for approval.",
    stages: [
      { id: "submit", label: "Submission", tech: ["REST API"], input: "Expense details", process: "Employee submits an expense", output: "Pending expense" },
      { id: "svc", label: "Spring Boot service", tech: ["Java", "Spring Boot"], input: "Request", process: "Validation and business rules", output: "Stored expense" },
      { id: "db", label: "MySQL", tech: ["MySQL"], input: "Expense", process: "Persisted with status", output: "Record" },
      { id: "approve", label: "Approval", tech: ["Spring Boot"], input: "Pending expense", process: "Approver approves or rejects", output: "Updated status" },
      { id: "report", label: "Reporting", tech: ["REST API"], input: "Expense records", process: "Aggregated into reports", output: "Report" },
    ],
    walkthrough: [
      { stage: "submit", text: "An employee submits an expense." },
      { stage: "svc", text: "The service validates it." },
      { stage: "db", text: "It is stored in MySQL as pending." },
      { stage: "approve", text: "An approver approves or rejects it." },
      { stage: "report", text: "Approved expenses appear in reports." },
    ],
    decisions: ["Layered Spring Boot service over MySQL with a clear approval state."],
    limitations: ["No performance figures are published for this project."],
    metrics: [],
  },
};
