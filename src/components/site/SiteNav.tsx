import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { profile, sections } from "@/data/profile";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.15, 0.4, 0.7], rootMargin: "-20% 0px -50% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="shell">
        <nav
          className={cn(
            "flex items-center justify-between gap-4 rounded-full px-4 py-2 transition-all duration-500",
            scrolled
              ? "border border-border bg-card/85 text-foreground shadow-soft backdrop-blur-xl"
              : "border border-transparent text-surface-foreground",
          )}
        >
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <span
              className={cn(
                "grid size-8 place-items-center rounded-full font-mono text-[11px] font-semibold transition-colors",
                scrolled
                  ? "bg-primary text-primary-foreground"
                  : "bg-signal text-signal-foreground",
              )}
            >
              SS
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">
              {profile.name}
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {sections.slice(0, 8).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-[13px] transition-colors",
                  scrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-surface-foreground/60 hover:text-surface-foreground",
                  active === s.id && (scrolled ? "text-foreground" : "text-surface-foreground"),
                )}
              >
                {s.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-signal transition-transform duration-300",
                    active === s.id && "scale-x-100",
                  )}
                />
              </a>
            ))}
          </div>

          <a
            href={`mailto:${profile.email}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-opacity hover:opacity-90",
              scrolled
                ? "bg-primary text-primary-foreground"
                : "bg-signal text-signal-foreground",
            )}
          >
            <Mail className="size-3.5" />
            <span className="hidden sm:inline">Get in touch</span>
            <span className="sm:hidden">Email</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
