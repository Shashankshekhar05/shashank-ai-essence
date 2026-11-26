import { experience } from "@/data/profile";
import { Reveal } from "./Reveal";

export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-24 bg-background py-24 md:py-32">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h2 className="mt-4 text-3xl leading-tight font-semibold md:text-[2.4rem]">
            Where I've worked
          </h2>
        </Reveal>

        <div className="mt-14 space-y-4">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 100}>
              <article className="rounded-2xl border border-border bg-card p-7 md:p-9">
                <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
                  <div>
                    <p className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-signal">
                      {job.period}
                    </p>
                    <h3 className="mt-3 text-xl leading-snug font-semibold">{job.role}</h3>
                    <p className="mt-1.5 text-[14px] text-muted-foreground">{job.company}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{job.place}</p>
                  </div>
                  <div>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">
                      {job.summary}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {job.points.map((p) => (
                        <li key={p} className="flex gap-3 text-[14px] leading-relaxed">
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-signal" />
                          <span className="text-foreground/80">{p}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {job.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-border px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-4 rounded-2xl border border-border bg-card p-7 md:p-9">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
              <div>
                <p className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-signal">
                  Expected May / June 2026
                </p>
                <h3 className="mt-3 text-xl leading-snug font-semibold">
                  B.Tech, Computer Science &amp; Engineering
                </h3>
                <p className="mt-1.5 text-[14px] text-muted-foreground">
                  Chandigarh Engineering College
                </p>
              </div>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Computer science foundation alongside professional AI engineering work — moving from
                backend development in Java and Python into Generative AI, RAG and agentic systems.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
