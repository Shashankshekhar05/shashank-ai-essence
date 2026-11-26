import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";

export function About() {
  const paragraphs = profile.about.split("\n\n");

  return (
    <section id="about" className="scroll-mt-24 bg-background py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">About</p>
          <h2 className="mt-4 text-3xl leading-tight font-semibold md:text-[2.4rem]">
            From backend engineering to production AI.
          </h2>
        </Reveal>

        <div className="space-y-5">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className="text-[16px] leading-[1.75] text-foreground/80">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
