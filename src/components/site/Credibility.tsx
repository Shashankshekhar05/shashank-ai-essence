import { credibility } from "@/data/profile";
import { Reveal } from "./Reveal";

export function Credibility() {
  return (
    <section className="border-b border-border bg-background">
      <div className="shell grid gap-px py-2 sm:grid-cols-2 lg:grid-cols-4">
        {credibility.map((item, i) => (
          <Reveal
            key={item.label}
            delay={i * 80}
            className="border-border py-7 lg:border-r lg:pr-6 lg:last:border-r-0 lg:[&:not(:first-child)]:pl-6"
          >
            <p className="eyebrow">{item.label}</p>
            <p className="mt-2 font-display text-[15px] leading-snug font-semibold">{item.value}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">{item.note}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
