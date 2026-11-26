import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";

export function ContactFooter() {
  return (
    <footer id="contact" className="band-dark relative scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 grain" aria-hidden />
      <div className="shell relative py-24 md:py-32">
        <Reveal>
          <p className="eyebrow-invert">Contact</p>
          <h2 className="mt-5 max-w-3xl text-3xl leading-[1.1] font-semibold md:text-[3rem]">
            Open to AI engineering roles — in India and globally, remote-ready.
          </h2>
          <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-surface-foreground/65">
            If you're hiring for Generative AI, LLM applications, voice AI or AI-backed backend
            systems, I'd be glad to talk.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-medium text-signal-foreground transition-transform hover:-translate-y-0.5"
            >
              <Mail className="size-4" />
              {profile.email}
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5"
            >
              <Github className="size-4" /> GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5"
            >
              <Linkedin className="size-4" /> LinkedIn
            </a>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-surface-foreground/45">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-surface-foreground/45">
            <MapPin className="size-3.5" /> Chandigarh, India
          </p>
        </div>
      </div>
    </footer>
  );
}
