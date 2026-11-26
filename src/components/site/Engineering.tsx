import { skillGroups } from "@/data/profile";
import { Reveal } from "./Reveal";

const pillars = [
  {
    title: "AI system design",
    body: "Framing an AI feature as a system: retrieval strategy, prompt and tool surface, validation boundaries, and how failures degrade gracefully.",
  },
  {
    title: "Provider abstraction",
    body: "Vendor-neutral interfaces with per-provider adapters, so telephony and voice-AI vendors can be swapped or added without touching call logic.",
  },
  {
    title: "Reliable integrations",
    body: "Idempotent webhook handling, retry with backoff, scheduled jobs, and OAuth2 flows for CRM platforms.",
  },
  {
    title: "Layered backends",
    body: "Route → Controller → Service → Database, with multi-tenant scoping, JWT/API-key auth and BYOK credential resolution enforced in one place.",
  },
];

export function Engineering() {
  return (
    <section id="engineering" className="scroll-mt-24 border-y border-border bg-muted/40 py-24 md:py-32">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Engineering capabilities</p>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold md:text-[2.4rem]">
            How I architect AI systems that have to keep working.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="card-lift h-full rounded-2xl border border-border bg-card p-6">
                <span className="font-mono text-[10.5px] tracking-[0.16em] text-signal">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-[16px] font-semibold">{p.title}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 60}>
              <h3 className="eyebrow">{group.title}</h3>
              <ul className="mt-3 space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="text-[13.5px] text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
