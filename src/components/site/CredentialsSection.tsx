import { Award, BadgeCheck } from "lucide-react";
import { credentials } from "@/data/profile";
import { Reveal } from "./Reveal";

export function CredentialsSection() {
  const certs = credentials.filter((c) => c.kind === "Certification");
  const courses = credentials.filter((c) => c.kind !== "Certification");

  return (
    <section id="credentials" className="scroll-mt-24 border-t border-border bg-muted/40 py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Credentials</p>
          <h2 className="mt-4 text-3xl leading-tight font-semibold md:text-[2.4rem]">
            Certification &amp; course completions
          </h2>
          <p className="mt-5 text-[14.5px] leading-relaxed text-muted-foreground">
            Listed exactly as earned — one certification, and course completions kept clearly
            labelled as course completions.
          </p>
        </Reveal>

        <div className="space-y-8">
          <Reveal>
            <h3 className="eyebrow">Certification</h3>
            <div className="mt-3 space-y-3">
              {certs.map((c) => (
                <div
                  key={c.name}
                  className="card-lift flex items-start gap-3 rounded-xl border border-border bg-card p-5"
                >
                  <BadgeCheck className="mt-0.5 size-4.5 shrink-0 text-signal" strokeWidth={1.7} />
                  <div>
                    <p className="text-[15px] leading-snug font-medium">{c.name}</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">{c.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h3 className="eyebrow">Course completions</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {courses.map((c) => (
                <div
                  key={c.name}
                  className="card-lift flex items-start gap-3 rounded-xl border border-border bg-card p-5"
                >
                  <Award className="mt-0.5 size-4.5 shrink-0 text-muted-foreground" strokeWidth={1.7} />
                  <div>
                    <p className="text-[14.5px] leading-snug font-medium">{c.name}</p>
                    <p className="mt-1 text-[12.5px] text-muted-foreground">
                      {c.issuer === "Course completion" ? "Course completion" : `${c.issuer} · course completion`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
