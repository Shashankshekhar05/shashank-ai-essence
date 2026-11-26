import { ArrowDownRight, Github, Linkedin, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import photoSrc from "@/assets/shashank-photo.jpg";
import { Reveal, useParallax } from "./Reveal";

export function Hero() {
  const { ref, offset } = useParallax(0.06);

  return (
    <section id="top" className="band-dark relative overflow-hidden">
      <div className="absolute inset-0 grain" aria-hidden />
      <div className="absolute inset-0 hairline-grid opacity-70" aria-hidden />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
        aria-hidden
      />

      <div className="shell relative pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <Reveal>
              <p className="eyebrow-invert">{profile.position}</p>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-6 max-w-[19ch] text-4xl leading-[1.03] font-semibold sm:text-5xl md:text-6xl lg:text-[4.1rem]">
                AI Engineer building{" "}
                <span className="text-signal">intelligent products</span> with Generative AI.
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.14em] uppercase text-surface-foreground/60">
                {profile.heroSupport.map((item, i) => (
                  <span key={item} className="flex items-center gap-3">
                    {i > 0 && <span className="text-signal/70">·</span>}
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={260}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-surface-foreground/70">
                AI Associate Software Engineer at Socomo Technologies / JungleWorks, building
                production voice AI infrastructure, telephony integrations, agent workflows and
                CRM-connected backend services.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="#voice-ai"
                  className="group inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-medium text-signal-foreground transition-transform hover:-translate-y-0.5"
                >
                  View featured case study
                  <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-3 text-sm font-medium text-surface-foreground transition-colors hover:bg-white/5"
                >
                  <Github className="size-4" /> GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-3 text-sm font-medium text-surface-foreground transition-colors hover:bg-white/5"
                >
                  <Linkedin className="size-4" /> LinkedIn
                </a>
              </div>
            </Reveal>

            <Reveal delay={420}>
              <p className="mt-8 flex items-center gap-2 text-[13px] text-surface-foreground/55">
                <MapPin className="size-3.5 text-signal" />
                {profile.location} — {profile.availability}
              </p>
            </Reveal>
          </div>

          <Reveal delay={220} className="justify-self-center lg:justify-self-end">
            <div ref={ref} style={{ transform: `translateY(${offset}px)` }} className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-signal/10 blur-2xl" aria-hidden />
              <figure className="relative w-[16rem] overflow-hidden rounded-[1.75rem] border border-hairline bg-white/[0.03] sm:w-[19rem]">
                <PhotoFrame />
                <figcaption className="flex items-center justify-between border-t border-hairline px-4 py-3 font-mono text-[10px] tracking-[0.16em] uppercase text-surface-foreground/50">
                  <span>Shashank Shekhar</span>
                  <span className="text-signal">AI Eng.</span>
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PhotoFrame() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="relative aspect-4/5 w-full overflow-hidden">
      <img
        ref={imgRef}
        src={photoSrc}
        alt="Shashank Shekhar — AI Engineer"
        width={760}
        height={950}
        className={`h-full w-full object-cover object-top transition-opacity duration-700 ${loaded && !error ? "opacity-100" : "opacity-0"
          }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        decoding="async"
      />

      {(!loaded || error) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-white/[0.05] to-white/[0.01]">
          <div className="rounded-full border border-hairline bg-white/[0.04] p-5">
            <div className="size-10 rounded-full border-2 border-dashed border-surface-foreground/25" />
          </div>
          <span className="whitespace-nowrap px-6 text-center font-mono text-[9px] tracking-[0.14em] uppercase text-surface-foreground/40 sm:text-[10px]">
            Portrait
          </span>
        </div>
      )}
    </div>
  );
}
