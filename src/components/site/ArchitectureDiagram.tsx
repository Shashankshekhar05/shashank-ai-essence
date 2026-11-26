import { useEffect, useState } from "react";
import { useInView } from "./Reveal";
import { cn } from "@/lib/utils";

const layers = [
  { id: "entry", label: "Lead / User", items: ["Inbound call", "Outbound campaign"] },
  { id: "telephony", label: "Telephony", items: ["Twilio", "Plivo"] },
  { id: "voice", label: "Voice AI", items: ["Ultravox", "Bolna"] },
  { id: "services", label: "FastAPI Services", items: ["Route → Controller", "Service → Database"] },
  { id: "state", label: "State & Storage", items: ["PostgreSQL", "Redis", "AWS S3"] },
  { id: "crm", label: "CRM", items: ["Zoho", "HubSpot", "GoHighLevel"] },
];

const flows = [
  {
    id: "warm",
    label: "Warm whisper transfer",
    detail:
      "Agent dials the human target, whispers context on a private leg, then bridges the caller in once the human accepts.",
  },
  {
    id: "cold",
    label: "Cold bridge transfer",
    detail:
      "Caller is bridged directly to the next available member of the hunt group, with sequential fallback on no-answer.",
  },
  {
    id: "a2a",
    label: "AI agent → AI agent",
    detail:
      "Live media re-stream to a second AI agent with a call-id swap, so the conversation continues on one normalized CallRecord.",
  },
];

export function ArchitectureDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const [step, setStep] = useState(0);
  const [flow, setFlow] = useState(flows[0]!.id);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(layers.length - 1);
      return;
    }
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % (layers.length + 2));
    }, 900);
    return () => clearInterval(timer);
  }, [inView]);

  const activeFlow = flows.find((f) => f.id === flow)!;

  return (
    <div ref={ref} className="rounded-3xl border border-hairline bg-white/[0.02] p-5 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="eyebrow-invert">Request path</p>
        <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-surface-foreground/40">
          normalized CallRecord pipeline
        </p>
      </div>

      <ol className="mt-6 grid gap-3 lg:grid-cols-6">
        {layers.map((layer, i) => {
          const active = inView && step >= i;
          return (
            <li key={layer.id} className="relative">
              <div
                className={cn(
                  "h-full rounded-xl border p-4 transition-all duration-700",
                  active
                    ? "border-signal/50 bg-signal/[0.08]"
                    : "border-hairline bg-white/[0.02] opacity-60",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-1.5 rounded-full transition-colors",
                      active ? "bg-signal node-pulse" : "bg-white/25",
                    )}
                  />
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-surface-foreground/50">
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-2 text-[13.5px] font-semibold text-surface-foreground">
                  {layer.label}
                </p>
                <ul className="mt-2 space-y-0.5">
                  {layer.items.map((it) => (
                    <li key={it} className="text-[11.5px] text-surface-foreground/55">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              {i < layers.length - 1 && (
                <svg
                  aria-hidden
                  viewBox="0 0 24 8"
                  className="absolute top-1/2 -right-3 hidden h-2 w-6 -translate-y-1/2 lg:block"
                >
                  <line
                    x1="0"
                    y1="4"
                    x2="24"
                    y2="4"
                    strokeWidth="1.5"
                    className={cn(
                      "stroke-signal/70",
                      inView && step >= i + 1 ? "flow-line" : "opacity-25",
                    )}
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 border-t border-hairline pt-6">
        <p className="eyebrow-invert">Transfer flows</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {flows.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFlow(f.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors",
                flow === f.id
                  ? "border-signal/60 bg-signal/15 text-surface-foreground"
                  : "border-hairline text-surface-foreground/60 hover:text-surface-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-surface-foreground/65">
          {activeFlow.detail}
        </p>
      </div>
    </div>
  );
}
