import { BookOpen, GraduationCap, Quote, Search, Sparkles, MessageSquare } from "lucide-react";
import { Reveal } from "./Reveal";

const capabilities = [
  { icon: MessageSquare, title: "Constitution Q&A", body: "Conversational answers grounded in retrieved constitutional content." },
  { icon: Search, title: "Provision retrieval", body: "Locate relevant articles and provisions for a question or topic." },
  { icon: Sparkles, title: "Plain-language explanations", body: "Simplifies dense legal language into understandable explanations." },
  { icon: Quote, title: "Source citations", body: "Answers carry source and reference citations back to the retrieved text." },
  { icon: BookOpen, title: "Context & follow-ups", body: "Conversation history so follow-up questions stay in context." },
  { icon: GraduationCap, title: "Quiz & summaries", body: "Learning mode with quizzes and summarization for revision." },
];

export function ConstitutionCaseStudy() {
  return (
    <section id="constitution" className="scroll-mt-24 bg-background py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Case study · Personal product</p>
            <h2 className="mt-4 text-3xl leading-tight font-semibold md:text-[2.4rem]">
              Constitutional Law AI Learning Assistant
            </h2>
            <p className="mt-6 text-[15.5px] leading-relaxed text-muted-foreground">
              A RAG application built to help students understand, explore and learn from
              constitutional content — retrieval over constitutional text, grounded answers with
              citations, and a learning mode for revision.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["Python", "FastAPI", "LangChain", "Hugging Face", "Grok API", "RAG"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-2.5 py-1 font-mono text-[10.5px] tracking-wide text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-8 rounded-xl border border-border bg-muted/60 p-4 text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Educational use only.</span> The
              assistant is a study aid for learning constitutional content and is not legal advice.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 70}>
                <div className="card-lift h-full rounded-2xl border border-border bg-card p-6">
                  <c.icon className="size-5 text-signal" strokeWidth={1.6} />
                  <h3 className="mt-4 text-[15px] font-semibold">{c.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
