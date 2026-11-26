import { useEffect, useState } from "react";
import { ShieldCheck, GitMerge, Layers, ScanSearch, ArrowRight } from "lucide-react";
import { Reveal, useInView } from "./Reveal";
import { cn } from "@/lib/utils";

const loop = [
  { label: "Prompt", note: "Describe the bug, the constraints I already know, and what must not change." },
  { label: "AI proposal", note: "Claude Code returns a clean, confident plan — readable and plausible." },
  { label: "Question assumptions", note: '"Why this approach specifically?" — the plan has to justify itself.' },
  { label: "Risk check", note: "Where could this widen trust boundaries, input handling or access paths?" },
  { label: "Constraints", note: "I state the boundaries the fix must respect before any code is accepted." },
  { label: "Revised solution", note: "The approach is rebuilt against those constraints, not around them." },
  { label: "Human validation", note: "I review, reason through the failure modes, and decide what ships." },
];

const chapters = [
  {
    kicker: "01 · Context",
    title: "A bug fix, delegated to AI",
    body: "I was working through a defect and used Claude Code as the implementation partner. The intent was speed on the mechanical part of the work — reading the surrounding code, drafting a change, keeping momentum — with the design call still mine.",
  },
  {
    kicker: "02 · First draft",
    title: "Clean, confident — and unexplained",
    body: "The first plan looked good. Tidy structure, direct path to a green result, no hedging. That confidence was the signal worth pausing on: the proposal read as finished but never argued for itself, and the reasoning behind the chosen approach was missing.",
  },
  {
    kicker: "03 · The pushback",
    title: "Asking the model to defend the design",
    body: 'I asked "Why this approach specifically?" and pushed further: could this shape of fix introduce a security flaw? Not an accusation — a review question. A change that touches how input, state or access is handled has to survive that question before it is worth merging.',
  },
  {
    kicker: "04 · Rebuild",
    title: "Re-evaluated against stated constraints",
    body: 'Claude acknowledged the concern — "You\'re right. Let me re-evaluate." — dropped the first plan, and asked for the constraints it had been missing. Once those boundaries were explicit, the solution was rebuilt to respect them instead of routing around them.',
  },
  {
    kicker: "05 · What changed",
    title: "From plausible to defensible",
    body: "The second version was not merely different code; it was a different reasoning path. The trade-offs were named, the assumptions were stated, and the risk question had an answer. Nothing unsafe reached a branch — this was a review catching a weak design early, which is exactly where review is supposed to work.",
  },
];

const principles = [
  {
    icon: Layers,
    title: "Confidence is not correctness",
    body: "Fluent output is a presentation quality, not a verification. A proposal earns trust by explaining its trade-offs.",
  },
  {
    icon: ScanSearch,
    title: "Always ask why this approach",
    body: "One question — why this shape and not another — surfaces the assumptions a clean diff quietly hides.",
  },
  {
    icon: ShieldCheck,
    title: "Constraints before code",
    body: "Security and architectural boundaries stated up front produce better proposals than corrections applied afterwards.",
  },
  {
    icon: GitMerge,
    title: "The human owns the merge",
    body: "AI can draft; accountability for what ships stays with the engineer who reviewed it.",
  },
];

const comparison = [
  {
    head: "First response",
    tone: "muted",
    rows: [
      "Optimised for looking finished",
      "Approach asserted, not justified",
      "Assumptions left implicit",
      "Risk surface unexamined",
      "Constraints never requested",
    ],
  },
  {
    head: "Re-evaluated response",
    tone: "signal",
    rows: [
      "Optimised for surviving review",
      "Trade-offs named and compared",
      "Assumptions stated explicitly",
      "Risk question answered directly",
      "Built against given constraints",
    ],
  },
];

const threatStages = [
  {
    label: "Assumptions",
    detail: "What the proposal takes for granted about callers, input shape and trust level.",
  },
  {
    label: "Attack surface",
    detail: "Which boundaries the change touches: input handling, state transitions, access paths.",
  },
  {
    label: "Validation gate",
    detail: "Explicit constraints and server-side checks the change must satisfy to be acceptable.",
  },
  {
    label: "Merge decision",
    detail: "A human judgement: understood, defensible, and safe enough to own.",
  },
];

const tools = [
  { name: "Claude Code", role: "Agentic implementation and refactor drafts in-repo" },
  { name: "OpenAI Codex", role: "Alternate drafting and code exploration" },
  { name: "OpenCode", role: "Open-source terminal-based coding agent" },
  { name: "Lovable", role: "Full-stack app and interface scaffolding" },
  { name: "Cursor", role: "Editor-native assistance while reading and editing code" },
];

function ReviewLoop() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!inView || !auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((s) => (s + 1) % loop.length), 2200);
    return () => clearInterval(t);
  }, [inView, auto]);

  return (
    <div ref={ref} className="rounded-3xl border border-hairline bg-white/[0.02] p-5 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="eyebrow-invert">The AI review loop</p>
        <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-surface-foreground/40">
          human in the loop, by design
        </p>
      </div>

      <ol className="mt-6 flex flex-col gap-2 lg:flex-row lg:items-stretch">
        {loop.map((s, i) => {
          const isActive = inView && i === active;
          const passed = inView && i < active;
          return (
            <li key={s.label} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onMouseEnter={() => {
                  setAuto(false);
                  setActive(i);
                }}
                onFocus={() => {
                  setAuto(false);
                  setActive(i);
                }}
                onMouseLeave={() => setAuto(true)}
                aria-current={isActive}
                className={cn(
                  "flex-1 rounded-xl border p-3 text-left transition-all duration-500",
                  isActive
                    ? "border-signal/60 bg-signal/[0.1]"
                    : passed
                      ? "border-hairline bg-white/[0.04]"
                      : "border-hairline bg-white/[0.02] opacity-60",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full transition-colors",
                      isActive ? "bg-signal node-pulse" : passed ? "bg-signal/50" : "bg-white/25",
                    )}
                  />
                  <span className="font-mono text-[10px] tracking-[0.14em] text-surface-foreground/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="mt-2 block text-[13.5px] font-medium text-surface-foreground">
                  {s.label}
                </span>
              </button>
              {i < loop.length - 1 && (
                <ArrowRight
                  aria-hidden
                  className="hidden size-3.5 shrink-0 text-surface-foreground/25 lg:block"
                />
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-6 min-h-[3rem] max-w-2xl text-[14px] leading-relaxed text-surface-foreground/65">
        <span className="font-mono text-[11px] tracking-[0.14em] text-signal">
          {loop[active]!.label.toUpperCase()}
        </span>
        <span className="mt-2 block">{loop[active]!.note}</span>
      </p>
    </div>
  );
}

function ThreatModel() {
  const [open, setOpen] = useState(0);

  return (
    <div className="rounded-3xl border border-hairline bg-white/[0.02] p-5 sm:p-8">
      <p className="eyebrow-invert">Conceptual review model</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {threatStages.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setOpen(i)}
            onMouseEnter={() => setOpen(i)}
            className={cn(
              "rounded-xl border p-4 text-left transition-all duration-500",
              open === i
                ? "border-signal/55 bg-signal/[0.08]"
                : "border-hairline bg-white/[0.02] opacity-70",
            )}
          >
            <span className="font-mono text-[10px] tracking-[0.14em] text-surface-foreground/45">
              STAGE {i + 1}
            </span>
            <span className="mt-2 block text-[14px] font-medium text-surface-foreground">
              {s.label}
            </span>
            <span
              className={cn(
                "mt-3 block overflow-hidden text-[13px] leading-relaxed text-surface-foreground/60 transition-all duration-500",
                open === i ? "max-h-32 opacity-100" : "max-h-0 opacity-0",
              )}
            >
              {s.detail}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-surface-foreground/45">
        Illustrative review model only — no vulnerability was shipped, and no incident, exploit or
        customer impact is being described.
      </p>
    </div>
  );
}

export function AiJudgmentCaseStudy() {
  return (
    <section id="ai-judgment" className="band-dark relative scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 hairline-grid opacity-50" aria-hidden />
      <div className="shell relative py-24 md:py-32">
        <Reveal>
          <p className="eyebrow-invert">Case study · Engineering practice</p>
          <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold md:text-[2.8rem]">
            Engineering with AI, not around it
          </h2>
          <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-surface-foreground/70">
            A review experience with Claude Code: a confident first plan, one question about why that
            approach, and a rebuild once constraints were on the table. The tooling accelerated the
            work — the judgement stayed with me.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.03] px-3 py-1.5">
            <span className="size-1.5 rounded-full bg-signal" aria-hidden />
            <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-surface-foreground/55">
              near-miss caught in review · nothing unsafe shipped
            </span>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <ReviewLoop />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {chapters.map((c, i) => (
            <Reveal
              key={c.kicker}
              delay={i * 80}
              className={i === chapters.length - 1 ? "lg:col-span-2" : ""}
            >
              <article className="card-lift h-full rounded-2xl border border-hairline bg-white/[0.03] p-6 sm:p-7">
                <p className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-signal">
                  {c.kicker}
                </p>
                <h3 className="mt-4 text-[19px] leading-snug font-semibold text-surface-foreground">
                  {c.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-surface-foreground/65">
                  {c.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80} className="mt-14">
          <div className="overflow-hidden rounded-3xl border border-hairline bg-white/[0.02]">
            <div className="flex items-center gap-2 border-b border-hairline px-5 py-3">
              <span className="size-2 rounded-full bg-white/20" aria-hidden />
              <span className="size-2 rounded-full bg-white/20" aria-hidden />
              <span className="size-2 rounded-full bg-signal/70" aria-hidden />
              <span className="ml-3 font-mono text-[10.5px] tracking-[0.14em] text-surface-foreground/45">
                review-diff · first-response ↔ re-evaluated
              </span>
            </div>
            <div className="grid gap-0 sm:grid-cols-2">
              {comparison.map((col, ci) => (
                <div
                  key={col.head}
                  className={cn(
                    "p-6 sm:p-7",
                    ci === 0 && "border-b border-hairline sm:border-b-0 sm:border-r",
                  )}
                >
                  <h3
                    className={cn(
                      "text-[15px] font-semibold",
                      col.tone === "signal" ? "text-signal" : "text-surface-foreground/70",
                    )}
                  >
                    {col.head}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.rows.map((r) => (
                      <li
                        key={r}
                        className="flex gap-2.5 text-[13.5px] leading-relaxed text-surface-foreground/65"
                      >
                        <span
                          className={cn(
                            "mt-2 size-1 shrink-0 rounded-full",
                            col.tone === "signal" ? "bg-signal" : "bg-white/25",
                          )}
                          aria-hidden
                        />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={90} className="mt-14">
          <ThreatModel />
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <p className="eyebrow-invert">Engineering principles</p>
          </Reveal>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="card-lift h-full rounded-2xl border border-hairline bg-white/[0.03] p-6">
                  <p.icon className="size-4 text-signal" aria-hidden />
                  <h3 className="mt-4 text-[15.5px] font-semibold text-surface-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-surface-foreground/65">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={80} className="mt-16">
          <div className="rounded-3xl border border-hairline bg-white/[0.02] p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="eyebrow-invert">AI-assisted development stack · tools I work with</p>
              <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-surface-foreground/40">
                acceleration, not delegation of judgement
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {tools.map((t, i) => (
                <div
                  key={t.name}
                  className="card-lift rounded-xl border border-hairline bg-white/[0.03] p-4"
                >
                  <span className="font-mono text-[10px] tracking-[0.14em] text-surface-foreground/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[14.5px] font-semibold text-surface-foreground">
                    {t.name}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-surface-foreground/60">
                    {t.role}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-[14px] leading-relaxed text-surface-foreground/65">
              These tools speed up implementation. Validation, architecture, security review,
              constraints and the decision about what ships stay with me.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
