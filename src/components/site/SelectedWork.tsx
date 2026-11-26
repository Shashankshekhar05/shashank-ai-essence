import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { DeepDiveButton } from "./ProjectDeepDive";
import { NewProjectShowcases } from "./VisualProjectCaseStudy";

const work = [
  {
    tag: "Production · Socomo Technologies",
    title: "Multi-tenant AI Voice Dialer & AI Sales Trainer",
    desc: "Backend platform orchestrating telephony providers and realtime voice agents: human transfers, agent-to-agent handoff, provider abstraction and CRM sync.",
    stack: ["FastAPI", "Ultravox", "Bolna", "Twilio / Plivo", "PostgreSQL", "Redis"],
    href: "#voice-ai",
    dive: "voice",
    cta: "Read case study",
  },
  {
    tag: "Personal product · RAG",
    title: "Constitutional Law AI Learning Assistant",
    desc: "A retrieval-augmented study assistant for constitutional content: grounded answers with citations, provision lookup, plain-language explanations and a quiz mode.",
    stack: ["LangChain", "Hugging Face", "Grok API", "FastAPI", "RAG"],
    href: "#constitution",
    dive: "constitution",
    cta: "Read case study",
  },
  {
    tag: "Engineering practice · AI-assisted development",
    title: "Engineering with AI, Not Around It",
    desc: "A review experience with Claude Code: a confident first plan, one question about why that approach and whether it could introduce a security flaw, then a rebuild against explicit constraints.",
    stack: ["Claude Code", "Code review", "Threat modelling", "Constraints-first"],
    href: "#ai-judgment",
    dive: "ai-judgment",
    cta: "Read case study",
  },
];

export function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-24 bg-background py-24 md:py-32">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Selected work</p>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold md:text-[2.6rem]">
            Production work, personal AI systems, and the judgment behind them.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {work.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 120}
              className={i === work.length - 1 ? "lg:col-span-2" : ""}
            >
              <div
                className="card-lift group flex h-full flex-col rounded-2xl border border-border bg-card p-8"
              >
                <p className="eyebrow">{item.tag}</p>
                <h3 className="mt-5 text-2xl leading-snug font-semibold">{item.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {item.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-[10.5px] tracking-wide text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href={item.href} className="inline-flex items-center gap-2 text-sm font-medium">
                    {item.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <DeepDiveButton id={item.dive} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <NewProjectShowcases />
      </div>
    </section>
  );
}
