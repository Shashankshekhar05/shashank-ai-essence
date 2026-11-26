export type FlowNode = {
  id: string;
  label: string;
  tech: string;
  detail: string;
  zone: "local" | "external" | "browser" | "human";
};
export type FlowBranch = { after: string; label: string; nodes: FlowNode[]; outcome: string };
export type ProjectFlow = {
  id: string;
  label: string;
  summary: string;
  nodes: FlowNode[];
  branches: FlowBranch[];
  note: string;
};
export type VisualProject = {
  id: string;
  name: string;
  tagline: string;
  href: string;
  problem: string;
  decisions: string[];
  safeguards: string[];
  limitations: string[];
  stack: { label: string; items: string[] }[];
  flows: ProjectFlow[];
};

// README-defined limits, not measured portfolio results.
export const tokenSaverRules = { waitSeconds: 120, maxRetryAttempts: 2, topChunks: 3, embeddingDimensions: 384 };
export const interviewRules = { speechEndSeconds: 2.5, inactivitySeconds: 50, gazeSeconds: 3, phoneConfidencePercent: 65, cooldownSeconds: 5, terminationStrikes: 3 };

export const visualProjects: VisualProject[] = [
  {
    id: "tokensaver",
    name: "TokenSaver RAG",
    tagline: "Local-first RAG with multi-level caching and asynchronous fallback.",
    href: "https://github.com/Shashankshekhar05/RAG-System-designed",
    problem: "Reduce repeat generation calls and keep a document question recoverable when the external LLM is rate-limited, slow, or unavailable.",
    decisions: [
      "Local infrastructure owns parsing, embeddings, retrieval, cache, queue and database; external Grok Free Tier owns generation.",
      "Exact-hash caching precedes semantic vector caching. Cache hits bypass generation; only safe answers are cached.",
      "Qdrant semantic/vector retrieval is combined with keyword retrieval and re-ranking. No unverified BM25 or RRF algorithm is claimed.",
      "PostgreSQL tracks users, documents, sessions, messages and jobs; a Redis List separates delayed answers from the interactive request.",
    ],
    safeguards: [
      `The FastAPI lifespan worker waits ${tokenSaverRules.waitSeconds} seconds before retrying, retrieves and keyword re-ranks to the top ${tokenSaverRules.topChunks} chunks, and applies grounding guardrails again.`,
      `At most ${tokenSaverRules.maxRetryAttempts} retry attempts; final failure sends a notice without losing the question record.`,
      "Successful delayed answers update PostgreSQL messages/email_jobs and are emailed with citations and an Open in Chat link via Gmail SMTP.",
    ],
    limitations: [
      "Not fully offline: Grok generation and Gmail SMTP are external services.",
      "₹0 cloud infrastructure / no paid services is README positioning, not a measured cost guarantee or a deployment claim. Free-tier availability and limits still apply.",
      "No benchmark, cache-hit rate, latency improvement or deployment is claimed here. The diagrams describe the README, not a live integration.",
    ],
    stack: [
      { label: "Interface", items: ["Next.js 14 App Router", "Tailwind CSS", "TypeScript"] },
      { label: "Application", items: ["Python 3.11", "FastAPI", "Uvicorn"] },
      { label: "Local data", items: ["PostgreSQL 16", "Redis 7", "Qdrant", "all-MiniLM-L6-v2 · 384 dimensions"] },
      { label: "External services", items: ["Grok Free Tier · grok-beta", "Gmail SMTP"] },
    ],
    flows: [
      {
        id: "ingestion", label: "Ingestion",
        summary: "Documents become locally searchable passages before a question reaches the LLM.",
        nodes: [
          { id: "upload", label: "PDF upload", tech: "Next.js 14 → FastAPI", detail: "A user uploads a PDF for the document ingestion pipeline.", zone: "local" },
          { id: "parse", label: "Parse & chunk", tech: "Python 3.11", detail: "PDF content is parsed and split into chunks for local indexing.", zone: "local" },
          { id: "embed", label: "Local embeddings", tech: "all-MiniLM-L6-v2", detail: `sentence-transformers produces ${tokenSaverRules.embeddingDimensions}-dimensional vectors locally; this stage does not call Grok.`, zone: "local" },
          { id: "vectors", label: "Vector storage", tech: "Qdrant", detail: "Chunk vectors are stored for semantic/vector retrieval.", zone: "local" },
        ],
        branches: [
          { after: "upload", label: "Application records", nodes: [{ id: "records", label: "Users & document state", tech: "PostgreSQL 16", detail: "Tracks users, documents, sessions, messages and jobs alongside the vector index.", zone: "local" }], outcome: "Relational state is separate from chunk vectors." },
        ],
        note: "Parsing, embeddings and vector storage run on local infrastructure. Grok is the later generation layer, not the embedding model.",
      },
      {
        id: "query", label: "Query",
        summary: "Two cache levels come before retrieval and external generation. A hit takes the short path.",
        nodes: [
          { id: "query", label: "User query", tech: "FastAPI", detail: "A document question enters the query pipeline.", zone: "local" },
          { id: "exact", label: "Exact-hash cache", tech: "Redis 7", detail: "Check for a previously cached safe answer to the exact query. A miss continues to semantic caching.", zone: "local" },
          { id: "semantic", label: "Semantic vector cache", tech: "Local vector lookup", detail: "Check for a semantically matching cached answer. A miss continues to document retrieval.", zone: "local" },
          { id: "retrieve", label: "Hybrid retrieval", tech: "Qdrant + keywords", detail: "Combine semantic/vector retrieval and keyword retrieval/re-ranking as described in the README.", zone: "local" },
          { id: "grok", label: "LLM generation", tech: "Grok Free Tier · grok-beta", detail: "Retrieved context goes to the external Grok generation API. Local infrastructure does not mean zero external LLM calls.", zone: "external" },
          { id: "ground", label: "Grounding guardrails", tech: "FastAPI", detail: "Apply grounding guardrails before returning an answer with citations.", zone: "local" },
          { id: "answer", label: "Answer & citations", tech: "Response → safe cache", detail: "Return the grounded answer and cache the safe result for future queries.", zone: "local" },
        ],
        branches: [
          { after: "exact", label: "Exact hit → bypass LLM", nodes: [{ id: "exact-hit", label: "Cached safe answer", tech: "No generation call", detail: "An exact cache hit returns a previously cached safe answer without invoking Grok generation.", zone: "local" }], outcome: "Return cached answer with citations." },
          { after: "semantic", label: "Semantic hit → bypass LLM", nodes: [{ id: "semantic-hit", label: "Cached safe answer", tech: "No generation call", detail: "A semantic cache hit bypasses the retrieval/generation path and returns the cached safe answer.", zone: "local" }], outcome: "Return cached answer with citations." },
          { after: "grok", label: "Rate limit / timeout / downtime", nodes: [{ id: "queue-link", label: "Queue delayed answer", tech: "Redis List", detail: "Immediately queue the question in email_callback_queue; the Fallback tab shows the worker path.", zone: "local" }], outcome: "Continue via asynchronous fallback." },
        ],
        note: "Main path: cache miss → retrieval → generation → guardrails. Branches show cache hits and the external-service failure path.",
      },
      {
        id: "fallback", label: "Fallback",
        summary: "A failed generation call becomes a recorded, bounded background job rather than a lost question.",
        nodes: [
          { id: "failure", label: "Grok unavailable", tech: "Rate limit / timeout / downtime", detail: "The external generation request fails or cannot complete immediately.", zone: "external" },
          { id: "queue", label: "Immediate enqueue", tech: "Redis List · email_callback_queue", detail: "The question is immediately queued for an asynchronous answer.", zone: "local" },
          { id: "wait", label: `Wait ${tokenSaverRules.waitSeconds} seconds`, tech: "FastAPI lifespan worker", detail: "An asynchronous worker waits before repeating retrieval and generation.", zone: "local" },
          { id: "reretrieve", label: `Re-retrieve · top ${tokenSaverRules.topChunks}`, tech: "Hybrid + keyword re-ranking", detail: "Repeat hybrid retrieval and keyword re-ranking, retaining the top three chunks for the retry.", zone: "local" },
          { id: "retry", label: "Retry generation", tech: `Grok · max ${tokenSaverRules.maxRetryAttempts} attempts`, detail: "Retry external Grok generation with the refreshed context; the attempt count is bounded.", zone: "external" },
          { id: "reground", label: "Ground & update", tech: "PostgreSQL messages/email_jobs", detail: "Apply grounding guardrails and update the stored messages and email jobs.", zone: "local" },
          { id: "email", label: "Answer email", tech: "Gmail SMTP", detail: "Send citations and an Open in Chat link with the delayed answer.", zone: "external" },
        ],
        branches: [
          { after: "retry", label: "Attempts exhausted → failure notice", nodes: [{ id: "notice", label: "Notify without data loss", tech: "Gmail SMTP + PostgreSQL", detail: "Send a failure notice while preserving the question record. Do not silently discard the question.", zone: "external" }], outcome: "Question record remains recoverable." },
        ],
        note: "The wait, top-three retrieval and two-attempt bound are README-defined behavior, not measured performance results.",
      },
    ],
  },
  {
    id: "interview-pro",
    name: "AI Interview Pro",
    tagline: "Autonomous recruitment workflow with adaptive voice interviews and browser-side AI proctoring.",
    href: "https://github.com/Shashankshekhar05/Ai_Assisted_interview",
    problem: "Connect resume alignment, adaptive voice interviews and reviewable proctoring evidence while leaving the final hiring decision with the recruiter.",
    decisions: [
      "Groq Qwen handles semantic alignment and adaptive questions; Whisper large-v3 handles speech-to-text. edge-tts handles question speech.",
      "Vision inference runs in the candidate’s browser with MediaPipe and TensorFlow.js, not on a server GPU.",
      "Web Audio API VAD automates answer submission; inactivity advances the interview rather than leaving a turn open indefinitely.",
      "Evaluation combines Q&A feedback with a timestamped proctoring evidence timeline. Recruiters record the final decision.",
    ],
    safeguards: [
      `VAD detects speech end after ${interviewRules.speechEndSeconds} seconds; a ${interviewRules.inactivitySeconds}-second inactivity safeguard auto-advances.`,
      `Off-screen gaze must exceed ${interviewRules.gazeSeconds} seconds; phone detection requires confidence above ${interviewRules.phoneConfidencePercent}%.`,
      `Violation handling uses a ${interviewRules.cooldownSeconds}-second cooldown; ${interviewRules.terminationStrikes} strikes terminate the interview session, not make a hiring decision.`,
      "Tab/window visibility and screen-share stop events contribute to the timestamped incident/evidence report for recruiter review.",
    ],
    limitations: [
      "This is a personal project; no deployment, screening accuracy or hiring outcome is claimed.",
      "Browser signals and model detections are evidence for review, not proof of misconduct or an autonomous hiring decision.",
      "Groq and edge-tts are external services. These diagrams are explanatory, not a live interview, camera feed or recruitment integration.",
    ],
    stack: [
      { label: "Application", items: ["Python 3.10+", "FastAPI", "Uvicorn", "SQLite", "PyMuPDF"] },
      { label: "Language & speech", items: ["Groq Cloud SDK · Qwen", "Whisper large-v3", "edge-tts"] },
      { label: "Interface", items: ["HTML5", "Modular vanilla JavaScript", "Tailwind CSS"] },
      { label: "Browser AI", items: ["MediaPipe Face Landmarker", "TensorFlow.js COCO-SSD", "Web Audio API VAD"] },
    ],
    flows: [
      {
        id: "screening", label: "Screening",
        summary: "Align a candidate’s extracted resume with the recruiter’s role and job description.",
        nodes: [
          { id: "jd", label: "Role & JD", tech: "Recruiter input", detail: "The recruiter enters the role and job description used for semantic alignment.", zone: "human" },
          { id: "pdf", label: "Candidate PDF", tech: "HTML5 upload", detail: "The candidate uploads a resume PDF.", zone: "browser" },
          { id: "extract", label: "Extract resume", tech: "PyMuPDF · FastAPI", detail: "Extract text from the PDF for the screening workflow.", zone: "local" },
          { id: "align", label: "Semantic alignment", tech: "Groq Cloud SDK · Qwen", detail: "Align the extracted resume with the role/JD using the LLM.", zone: "external" },
          { id: "profile", label: "Screening profile", tech: "Score + analysis", detail: "Return a match score, strengths, missing skills and an experience profile. No screening accuracy metric is claimed.", zone: "local" },
        ], branches: [],
        note: "The match score is screening output, not an automated hire/reject decision.",
      },
      {
        id: "interview", label: "Interview",
        summary: "Speech and silence drive the adaptive question–answer loop.",
        nodes: [
          { id: "question", label: "Adaptive question", tech: "Groq · Qwen", detail: "Generate an adaptive interview question using the conversation context.", zone: "external" },
          { id: "speak", label: "Question speech", tech: "edge-tts", detail: "Convert the question to speech.", zone: "external" },
          { id: "mic", label: "Microphone activates", tech: "Candidate browser", detail: "The browser microphone captures the candidate’s spoken answer.", zone: "browser" },
          { id: "vad", label: "Detect speech end", tech: `Web Audio VAD · ${interviewRules.speechEndSeconds} sec`, detail: "After 2.5 seconds of speech-end detection, the answer is automatically submitted.", zone: "browser" },
          { id: "submit", label: "Auto-submit answer", tech: "Browser → FastAPI", detail: "Send the captured answer for speech-to-text processing without a manual submit action.", zone: "local" },
          { id: "whisper", label: "Transcribe", tech: "Groq · Whisper large-v3", detail: "Transcribe the answer and use it to inform the next adaptive question.", zone: "external" },
        ],
        branches: [
          { after: "vad", label: `${interviewRules.inactivitySeconds} sec inactivity → auto-advance`, nodes: [{ id: "idle", label: "Next question", tech: "Inactivity safeguard", detail: "The 50-second inactivity safeguard auto-advances instead of blocking the interview indefinitely.", zone: "local" }], outcome: "Continue the adaptive interview." },
          { after: "whisper", label: "Answer context → next adaptive question", nodes: [{ id: "next", label: "Repeat question loop", tech: "Groq · Qwen", detail: "Use the transcribed answer to generate the next adaptive question.", zone: "external" }], outcome: "Returns to adaptive question generation." },
        ],
        note: "Whisper is speech-to-text; edge-tts is text-to-speech; Web Audio VAD detects speech activity in the browser.",
      },
      {
        id: "proctoring", label: "Proctoring",
        summary: "Browser-side signals pass through explicit rules before becoming reviewable evidence.",
        nodes: [
          { id: "signals", label: "Candidate signals", tech: "Camera + browser events", detail: "Gaze/face, object detection, tab/window visibility and screen-share stop events feed the rule pipeline.", zone: "browser" },
          { id: "vision", label: "Edge vision inference", tech: "MediaPipe + COCO-SSD", detail: "MediaPipe Face Landmarker supplies gaze/face signals; TensorFlow.js COCO-SSD detects objects. Both vision models run in the candidate’s browser, not on a server GPU.", zone: "browser" },
          { id: "rules", label: "Rules & cooldown", tech: `Gaze >${interviewRules.gazeSeconds}s · phone >${interviewRules.phoneConfidencePercent}%`, detail: `Off-screen gaze exceeds 3 seconds; phone confidence exceeds 65%. Violation handling uses a ${interviewRules.cooldownSeconds}-second cooldown.`, zone: "browser" },
          { id: "evidence", label: "Timestamped evidence", tech: "Snapshots + incident timeline", detail: "Record timestamped evidence snapshots and incidents for the interview report.", zone: "local" },
          { id: "review", label: "Recruiter review", tech: "Report evidence", detail: "The recruiter reviews the evidence. Signals are not presented here as proof of misconduct.", zone: "human" },
        ],
        branches: [
          { after: "rules", label: `${interviewRules.terminationStrikes} strikes → terminate session`, nodes: [{ id: "terminate", label: "Stop interview session", tech: "Three-strike safeguard", detail: "Three strikes trigger session termination. This is a session safeguard, not an automatic rejection or hiring decision.", zone: "browser" }], outcome: "Evidence remains in the report for recruiter review." },
          { after: "signals", label: "Non-vision event inputs", nodes: [{ id: "events", label: "Visibility / share-stop", tech: "Tab, window, screen-share", detail: "Tab/window visibility and screen-share stop events also enter violation handling; they do not require vision inference.", zone: "browser" }], outcome: "Joins the rules and cooldown stage." },
        ],
        note: "Browser AI ≠ server GPU inference. Session termination ≠ a hiring decision.",
      },
      {
        id: "evaluation", label: "Evaluation",
        summary: "Interview feedback and evidence support a final human decision.",
        nodes: [
          { id: "qa", label: "Interview Q&A", tech: "Recorded answers", detail: "Interview questions and answers form the evaluation input.", zone: "local" },
          { id: "scores", label: "Scores & feedback", tech: "Evaluation output", detail: "Overall, technical, problem-solving, communication and role-fit scores plus per-question feedback.", zone: "local" },
          { id: "timeline", label: "Incident timeline", tech: "Timestamped evidence", detail: "Attach the proctoring incident timeline and evidence to the report.", zone: "local" },
          { id: "decision", label: "Final recruiter decision", tech: "Approve / follow-up / reject", detail: "The recruiter records approve final round, request follow-up or reject. The system does not autonomously make the hiring decision.", zone: "human" },
        ], branches: [],
        note: "Scores and evidence inform the recruiter; the final decision remains human-owned.",
      },
    ],
  },
];

// Shared public facts power the portfolio and its existing assistant; no provider changes.
export const newProjectKnowledge = visualProjects.map((project) => ({
  title: `${project.name} (personal project)`,
  content: [
    project.tagline, `Repository: ${project.href}. Personal project, not professional work; no deployment is claimed.`,
    project.problem,
    ...project.stack.map((group) => `${group.label}: ${group.items.join(", ")}.`),
    ...project.flows.map((flow) => `${flow.label}: ${flow.nodes.map((node) => `${node.label} (${node.tech}): ${node.detail}`).join(" → ")}. ${flow.branches.map((branch) => `${branch.label}: ${branch.nodes.map((node) => node.detail).join(" ")} ${branch.outcome}`).join(" ")} ${flow.note}`),
    ...project.decisions, ...project.safeguards, ...project.limitations,
  ].join("\n"),
}));