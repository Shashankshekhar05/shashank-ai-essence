import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Reveal } from "./Reveal";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { cn } from "@/lib/utils";

const highlights = [
  {
    title: "Human transfer & hunt groups",
    body: "Warm whisper and cold bridge transfer modes, with hunt-group routing so a call reaches the right human without dropping the AI context.",
  },
  {
    title: "AI agent → AI agent handoff",
    body: "Live media re-stream plus call-id swap moves a conversation between AI agents while keeping one continuous call record.",
  },
  {
    title: "Provider integration (Bolna)",
    body: "Bolna added alongside Ultravox with retries, webhook handling and BYOK, normalized into the shared CallRecord pipeline.",
  },
  {
    title: "CRM sync",
    body: "Zoho CRM OAuth2 bidirectional lead sync and HubSpot OAuth2 CRM v3 contact sync, both writing post-call notes; HubSpot also consumes webhooks.",
  },
];

const decisions = [
  {
    q: "Why a provider abstraction layer?",
    a: "Telephony and voice-AI vendors differ in call lifecycle, media handling and webhook payloads. A single provider interface with per-provider adapters keeps business logic vendor-neutral, so adding Bolna next to Ultravox did not require rewriting call flows — every provider normalizes into one shared CallRecord shape.",
  },
  {
    q: "Why idempotent webhooks and async retries?",
    a: "Providers re-deliver webhooks and can deliver out of order. Handlers are keyed on provider event identity so repeat deliveries are safe, and an asyncio-based retry path with backoff (plus Celery/APScheduler for scheduled work) keeps post-call side effects such as CRM notes from being lost on transient failures.",
  },
  {
    q: "Why tool-based AI control with server-side validation?",
    a: "The AI agent triggers actions like transfers and CRM writes through defined tools rather than free-form output. Every tool call is validated server-side with Pydantic 2 before it can affect telephony or tenant data, which keeps model behaviour inside a known action surface.",
  },
  {
    q: "Why layered architecture (Route → Controller → Service → Database)?",
    a: "Routes stay thin, controllers handle request orchestration, services own domain rules, and the data layer is the only place touching SQLAlchemy models. This makes multi-tenant boundaries, JWT/API-key auth and BYOK credential resolution easy to enforce consistently.",
  },
  {
    q: "What I'd harden next",
    a: "Deeper observability around call state transitions (structured tracing per call leg), contract tests against provider webhook payloads, chaos testing on transfer paths, and a formal replay tool for failed webhook events so recovery is operational rather than manual.",
  },
];

export function VoiceCaseStudy() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="voice-ai" className="band-dark relative scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 hairline-grid opacity-60" aria-hidden />
      <div className="shell relative py-24 md:py-32">
        <Reveal>
          <p className="eyebrow-invert">Featured case study · Production</p>
          <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold md:text-[2.8rem]">
            Multi-tenant AI voice dialer &amp; AI sales trainer backend
          </h2>
          <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-surface-foreground/70">
            At Socomo Technologies / JungleWorks I build the backend that connects telephony
            providers, realtime voice agents and CRM systems into one multi-tenant platform —
            covering call orchestration, transfers, provider integrations and post-call data flow.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <ArchitectureDiagram />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 90}>
              <div className="card-lift h-full rounded-2xl border border-hairline bg-white/[0.03] p-6">
                <h3 className="text-[17px] font-semibold text-surface-foreground">{h.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-surface-foreground/65">
                  {h.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80} className="mt-14">
          <div className="rounded-2xl border border-hairline bg-white/[0.02] p-2 sm:p-4">
            <p className="eyebrow-invert px-4 pt-3">Engineering decisions</p>
            <div className="mt-2 divide-y divide-white/10">
              {decisions.map((d, i) => (
                <div key={d.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                  >
                    <span className="text-[15px] font-medium text-surface-foreground">{d.q}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-signal transition-transform duration-300",
                        open === i && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-500",
                      open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <p className="overflow-hidden px-4 pb-5 text-[14px] leading-relaxed text-surface-foreground/65">
                      {d.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <div className="flex flex-wrap gap-2">
            {[
              "Python 3",
              "FastAPI",
              "SQLAlchemy 2",
              "Pydantic 2",
              "PostgreSQL",
              "Redis",
              "Twilio",
              "Plivo",
              "Ultravox",
              "Bolna",
              "APScheduler",
              "Celery",
              "asyncio retries",
              "AWS S3",
              "JWT / API-key auth",
              "BYOK",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-hairline px-3 py-1 font-mono text-[10.5px] tracking-wide text-surface-foreground/60"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
