import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Workflow } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deepDives, MEASURE } from "@/data/deep-dives";
import { cn } from "@/lib/utils";

export function DeepDiveButton({ id, className }: { id: string; className?: string }) {
  const d = deepDives[id];
  const [open, setOpen] = useState(false);
  if (!d) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors hover:border-signal hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            className,
          )}
        >
          <Workflow className="size-3.5" /> Explore how it works
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-2xl p-5 sm:p-8">
        {open && <DeepDiveBody id={id} />}
      </DialogContent>
    </Dialog>
  );
}

function DeepDiveBody({ id }: { id: string }) {
  const d = deepDives[id]!;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(d.walkthrough[0]!.stage);
  const last = d.walkthrough.length - 1;

  const go = (i: number) => {
    const n = Math.max(0, Math.min(last, i));
    setStep(n);
    setSelected(d.walkthrough[n]!.stage);
  };

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => {
      if (step >= last) setPlaying(false);
      else go(step + 1);
    }, 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, step]);

  const stage = d.stages.find((s) => s.id === selected)!;
  const activeIdx = d.stages.findIndex((s) => s.id === selected);

  return (
    <div className="space-y-8">
      <div className="pr-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">Technical deep dive</span>
          <span className="rounded-full border border-signal/50 bg-signal/10 px-2.5 py-0.5 font-mono text-[10.5px] tracking-wide uppercase">
            Interactive simulation
          </span>
        </div>
        <DialogTitle className="mt-3 text-2xl leading-snug font-semibold">{d.title}</DialogTitle>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">{d.context}</p>
        <DialogDescription className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
          {d.summary}
        </DialogDescription>
      </div>

      <section aria-label="Architecture diagram">
        <p className="eyebrow">Architecture · select a stage</p>
        <ol className="mt-4 flex flex-col items-stretch gap-1 md:flex-row md:flex-wrap md:items-center">
          {d.stages.map((s, i) => (
            <li key={s.id} className="flex flex-col items-center md:flex-row">
              <button
                type="button"
                onClick={() => setSelected(s.id)}
                aria-pressed={selected === s.id}
                className={cn(
                  "w-full rounded-xl border px-3 py-2 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:w-auto",
                  selected === s.id
                    ? "border-signal bg-signal/10 shadow-sm"
                    : i <= activeIdx
                      ? "border-signal/30"
                      : "border-border hover:border-foreground/30",
                )}
              >
                <span className="font-mono text-[10px] text-muted-foreground">0{i + 1}</span>
                <span className="block text-[13px] font-semibold">{s.label}</span>
              </button>
              {i < d.stages.length - 1 && (
                <>
                  <ArrowDown aria-hidden className="my-0.5 size-3.5 text-muted-foreground md:hidden" />
                  <ArrowRight aria-hidden className="mx-1 hidden size-3.5 text-muted-foreground md:block" />
                </>
              )}
            </li>
          ))}
        </ol>

        <div aria-live="polite" className="mt-4 grid gap-3 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-3">
          {[
            ["Input", stage.input],
            ["Processing", stage.process],
            ["Output", stage.output],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{k}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed">{v}</p>
            </div>
          ))}
          <div className="flex flex-wrap gap-1.5 sm:col-span-3">
            {stage.tech.map((t) => (
              <span key={t} className="rounded-full border border-border px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Execution walkthrough">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Walkthrough</p>
            <p className="mt-1 text-[13px] text-muted-foreground">Sample: {d.sample}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <CtlBtn label="Previous step" onClick={() => go(step - 1)} disabled={step === 0}>
              <ChevronLeft className="size-4" />
            </CtlBtn>
            <CtlBtn
              label={playing ? "Pause" : "Play"}
              onClick={() => {
                if (!playing && step >= last) go(0);
                setPlaying((p) => !p);
              }}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </CtlBtn>
            <CtlBtn label="Next step" onClick={() => go(step + 1)} disabled={step === last}>
              <ChevronRight className="size-4" />
            </CtlBtn>
          </div>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-signal transition-all duration-500" style={{ width: `${((step + 1) / (last + 1)) * 100}%` }} />
        </div>
        <p aria-live="polite" className="mt-3 text-[14.5px] leading-relaxed">
          <span className="font-mono text-[11px] text-muted-foreground">
            Step {step + 1}/{last + 1} ·{" "}
          </span>
          {d.walkthrough[step]!.text}
        </p>
      </section>

      <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-2">
        <div>
          <p className="eyebrow">Decisions & trade-offs</p>
          <ul className="mt-3 space-y-2 text-[13.5px] leading-relaxed text-muted-foreground">
            {d.decisions.map((x) => <li key={x}>— {x}</li>)}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Limitations & evaluation</p>
          <ul className="mt-3 space-y-2 text-[13.5px] leading-relaxed text-muted-foreground">
            {d.limitations.map((x) => <li key={x}>— {x}</li>)}
          </ul>
          {d.metrics.length > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-2">
              {d.metrics.map((m) => (
                <div key={m.label} className="rounded-lg border border-dashed border-border p-2.5">
                  <dt className="font-mono text-[10px] text-muted-foreground uppercase">{m.label}</dt>
                  <dd className={cn("mt-1 text-[12.5px]", m.value === MEASURE && "text-muted-foreground italic")}>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
      <p className="text-[11.5px] text-muted-foreground">
        Simulated walkthrough based on the project description — not a live call to the backend.
      </p>
    </div>
  );
}

function CtlBtn({ label, children, ...p }: { label: string; children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-8 place-items-center rounded-full border border-border transition-colors hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-40"
      {...p}
    >
      {children}
    </button>
  );
}
