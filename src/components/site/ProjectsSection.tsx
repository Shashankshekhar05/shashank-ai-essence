import { ArrowUpRight, Github } from "lucide-react";
import { secondaryProjects } from "@/data/profile";
import { Reveal } from "./Reveal";
import { DeepDiveButton } from "./ProjectDeepDive";

const diveIds = ["finance", "tickets", "expense"];

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-24 border-t border-border bg-background py-24 md:py-32">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">More projects</p>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold md:text-[2.4rem]">
            Smaller builds, same engineering habits.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {secondaryProjects.map((p, i) => (
            <Reveal key={p.name} delay={i * 100}>
              <div
                className="card-lift group flex h-full flex-col rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[17px] leading-snug font-semibold">{p.name}</h3>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                  {p.blurb}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-muted-foreground hover:text-foreground"
                  >
                    <Github className="size-3.5" /> Source
                  </a>
                  <DeepDiveButton id={diveIds[i]!} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
