import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  MessageSquareDashed,
  Mic,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { askPortfolioAssistant, type ChatRole } from "@/lib/assistant.functions";
import { transcribeQuestion } from "@/lib/transcribe.functions";
import { suggestedPrompts } from "@/data/knowledge";
import {
  ctas,
  getFollowUps,
  greetingQuickActions as quickActions,
  matchProjectCard,
  projectCards,
  recruiterSummaryAction,
  shouldShowCtas,
  visitorIntents,
} from "@/data/assistant-ui";
import { cn } from "@/lib/utils";

const MAX_CHARS = 1000;
const MAX_HISTORY = 12;

type MessageMeta = { followUps: string[]; cardId?: string | undefined; showCtas: boolean };

type Message = {
  id: string;
  role: ChatRole;
  content: string;
  meta?: MessageMeta | undefined;
};

const greeting: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi — I'm Shashank's Portfolio Assistant. Ask me about his work, projects, tech stack or how to get in touch. You can type or use the mic.",
};

function pickMimeType(): string {
  const candidates = ["audio/webm", "audio/mp4", "audio/ogg"];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

const GREETING_SEEN_KEY = "portfolio-assistant-greeted";

const GREETING_TEXT =
  "Hey there! 👋 How can I help you?\n\nYou can ask me about Shashank's AI projects, technical experience, skills, or how to get in touch.";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleIn, setBubbleIn] = useState(false);

  const ask = useServerFn(askPortfolioAssistant);
  const transcribe = useServerFn(transcribeQuestion);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastUserText = useRef<string>("");
  const recorderRef = useRef<MediaRecorder | null>(null);


  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(GREETING_SEEN_KEY)) return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem(GREETING_SEEN_KEY)) return;
      } catch {
        /* ignore */
      }
      setBubbleVisible(true);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!bubbleVisible) {
      setBubbleIn(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setBubbleIn(true));
    return () => window.cancelAnimationFrame(id);
  }, [bubbleVisible]);

  const dismissBubble = useCallback(() => {
    try {
      sessionStorage.setItem(GREETING_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setBubbleVisible(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!speakReplies || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const plain = text
        .replace(/[*_`#>]/g, "")
        .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 700);
      if (!plain) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(plain);
      utterance.rate = 1.02;
      window.speechSynthesis.speak(utterance);
    },
    [speakReplies],
  );

  useEffect(() => {
    if (!speakReplies && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [speakReplies]);

  const send = useCallback(

    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_CHARS);
      if (!text || sending) return;

      lastUserText.current = text;
      setFailed(null);
      setInput("");
      setSending(true);

      const nextMessages: Message[] = [
        ...messages,
        { id: `u-${Date.now()}`, role: "user", content: text },
      ];
      setMessages(nextMessages);

      try {
        const reply = await ask({
          data: {
            messages: nextMessages
              .filter((m) => m.id !== "greeting")
              .slice(-MAX_HISTORY)
              .map((m) => ({ role: m.role, content: m.content })),
          },
        });
        const meta: MessageMeta | undefined =
          reply.status === "ok"
            ? {
                followUps: getFollowUps(text, reply.message),
                cardId: matchProjectCard(text, reply.message)?.id,
                showCtas: shouldShowCtas(text, reply.message),
              }
            : undefined;
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: reply.message, meta },
        ]);
        if (reply.status === "ok") speak(reply.message);
        if (reply.status === "error") setFailed(text);

      } catch {
        setFailed(text);
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: "I couldn't get an answer just now. Please try again.",
          },
        ]);
      } finally {
        setSending(false);
        textareaRef.current?.focus();
      }
    },
    [ask, messages, sending, speak],
  );

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
  }, []);

  const startRecording = useCallback(async () => {
    if (recording || transcribing || sending) return;
    setVoiceNote(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setVoiceNote("Voice input isn't supported in this browser.");
      return;
    }
    const mimeType = pickMimeType();
    if (!mimeType) {
      setVoiceNote("Voice input isn't supported in this browser.");
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setVoiceNote("Microphone access is needed to ask by voice.");
      return;
    }

    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];
    recorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      recorderRef.current = null;
      setRecording(false);

      const blob = new Blob(chunks, { type: mimeType });
      if (blob.size < 2048) {
        setVoiceNote("That recording was empty — please try again.");
        return;
      }

      setTranscribing(true);
      try {
        const buffer = new Uint8Array(await blob.arrayBuffer());
        let binary = "";
        for (let i = 0; i < buffer.length; i += 8192) {
          binary += String.fromCharCode(...buffer.subarray(i, i + 8192));
        }
        const result = await transcribe({
          data: { audioBase64: btoa(binary), mimeType },
        });
        if (result.status === "ok" && result.text) {
          await send(result.text);
        } else {
          setVoiceNote(result.message ?? "Couldn't transcribe that recording.");
        }
      } catch {
        setVoiceNote("Couldn't transcribe that recording. Please try again.");
      } finally {
        setTranscribing(false);
      }
    };

    recorder.start();
    setRecording(true);
  }, [recording, sending, send, transcribe, transcribing]);

  useEffect(() => {
    if (!open && recorderRef.current) recorderRef.current.stop();
  }, [open]);



  const togglePanel = useCallback(() => {
    setOpen((v) => {
      if (!v) dismissBubble();
      return !v;
    });
  }, [dismissBubble]);

  const handleQuickAction = useCallback(
    (prompt: string) => {
      dismissBubble();
      setOpen(true);
      void send(prompt);
    },
    [dismissBubble, send],
  );

  return (
    <>
      <button
        type="button"
        onClick={togglePanel}
        aria-expanded={open}
        aria-controls="portfolio-assistant-panel"
        aria-label={open ? "Close Shashank's AI assistant" : "Ask Shashank's AI"}
        className={cn(
          "fixed right-4 bottom-12 z-[60] inline-flex items-center gap-2 rounded-full border border-hairline bg-primary px-4 py-3 text-[13px] font-medium text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-12",
          open && "opacity-0 pointer-events-none",
        )}
      >
        <Sparkles className="size-4 text-signal" />
        <span className="hidden sm:inline">Ask Shashank's AI</span>
        <span className="sm:hidden">Ask AI</span>
      </button>

      {bubbleVisible && !open && (
        <div
          role="region"
          aria-label="Assistant greeting"
          className={cn(
            "fixed right-4 bottom-[6.75rem] z-[60] w-[calc(100vw-2rem)] max-w-[320px] rounded-2xl border border-hairline bg-[oklch(0.16_0.008_260)] p-4 text-surface-foreground shadow-lift transition-all duration-300 ease-out motion-reduce:transition-none sm:right-6",
            bubbleIn ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <button
            type="button"
            onClick={dismissBubble}
            aria-label="Dismiss greeting"
            className="absolute top-2 right-2 rounded-full p-1.5 text-surface-foreground/55 transition-colors hover:bg-white/5 hover:text-surface-foreground"
          >
            <X className="size-3.5" />
          </button>
          <p className="pr-6 text-[13.5px] leading-relaxed whitespace-pre-line text-surface-foreground/85">
            {GREETING_TEXT}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => handleQuickAction(action.prompt)}
                className="rounded-full border border-hairline px-2.5 py-1.5 text-[12px] text-surface-foreground/70 transition-colors hover:bg-white/5 hover:text-surface-foreground"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {open && (
        <div
          id="portfolio-assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Shashank's Portfolio Assistant"
          className="fixed inset-x-3 bottom-10 z-[60] flex max-h-[80svh] flex-col overflow-hidden rounded-2xl border border-hairline bg-[oklch(0.16_0.008_260)] text-surface-foreground shadow-lift sm:inset-x-auto sm:right-6 sm:bottom-12 sm:h-[560px] sm:w-[400px]"
        >
          <header className="flex items-start justify-between gap-3 border-b border-hairline px-4 py-3.5">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <Sparkles className="size-3.5 text-signal" />
                Shashank's Portfolio Assistant
              </p>
              <p className="mt-1 text-[12px] text-surface-foreground/55">
                Ask about work, projects, skills, or experience.
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSpeakReplies((v) => !v)}
                aria-pressed={speakReplies}
                aria-label={speakReplies ? "Turn off spoken answers" : "Turn on spoken answers"}
                className={cn(
                  "rounded-full p-2 transition-colors hover:bg-white/5",
                  speakReplies
                    ? "text-signal"
                    : "text-surface-foreground/55 hover:text-surface-foreground",
                )}
              >
                {speakReplies ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
              </button>
              <button

                type="button"
                onClick={() => {
                  setMessages([greeting]);
                  setFailed(null);
                  textareaRef.current?.focus();
                }}
                aria-label="Clear conversation"
                className="rounded-full p-2 text-surface-foreground/55 transition-colors hover:bg-white/5 hover:text-surface-foreground"
              >
                <RotateCcw className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="rounded-full p-2 text-surface-foreground/55 transition-colors hover:bg-white/5 hover:text-surface-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, index) => {
              const card = m.meta?.cardId
                ? projectCards.find((p) => p.id === m.meta?.cardId)
                : undefined;
              const isLast = index === messages.length - 1;
              return (
                <div key={m.id} className="space-y-3">
                  <div className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[86%] text-[14px] leading-relaxed whitespace-pre-wrap",
                        m.role === "user"
                          ? "rounded-2xl rounded-br-sm bg-signal px-3.5 py-2.5 text-signal-foreground"
                          : "text-surface-foreground/85",
                      )}
                    >
                      {m.content}
                    </div>
                  </div>

                  {card && (
                    <article className="rounded-xl border border-hairline bg-white/[0.03] p-3.5">
                      <p className="text-[13.5px] font-semibold tracking-tight">{card.name}</p>
                      <p className="mt-1 text-[12px] text-surface-foreground/55">{card.context}</p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {card.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[10.5px] tracking-[0.06em] text-surface-foreground/65"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2.5 text-[12.5px] leading-relaxed text-surface-foreground/75">
                        {card.focus}
                      </p>
                      <a
                        href={card.href}
                        {...(card.href.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : { onClick: () => setOpen(false) })}
                        className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-signal transition-opacity hover:opacity-80"
                      >
                        {card.ctaLabel} <span aria-hidden>→</span>
                      </a>
                    </article>
                  )}

                  {m.meta?.showCtas && (
                    <div className="flex flex-wrap gap-1.5">
                      {ctas.map((c) => (
                        <a
                          key={c.key}
                          href={c.href}
                          {...(c.href.startsWith("http")
                            ? { target: "_blank", rel: "noreferrer noopener" }
                            : {})}
                          className="rounded-full border border-hairline px-2.5 py-1.5 text-[12px] text-surface-foreground/75 transition-colors hover:bg-white/5 hover:text-surface-foreground"
                        >
                          {c.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {isLast && !sending && m.meta && m.meta.followUps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.meta.followUps.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => send(q)}
                          className="rounded-full border border-hairline px-2.5 py-1.5 text-left text-[12px] text-surface-foreground/70 transition-colors hover:bg-white/5 hover:text-surface-foreground"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {sending && (
              <p
                className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-surface-foreground/45"
                aria-live="polite"
              >
                <MessageSquareDashed className="size-3.5 animate-pulse" /> Thinking…
              </p>
            )}

            {(recording || transcribing) && (
              <p
                className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-signal"
                aria-live="polite"
              >
                <span className="inline-block size-2 animate-pulse rounded-full bg-signal" />
                {recording ? "Listening…" : "Transcribing…"}
              </p>
            )}

            {voiceNote && !recording && !transcribing && (
              <p className="text-[12px] text-surface-foreground/55">{voiceNote}</p>
            )}


            {failed && !sending && (
              <button
                type="button"
                onClick={() => send(failed)}
                className="rounded-full border border-hairline px-3 py-1.5 text-[12px] text-surface-foreground/75 transition-colors hover:bg-white/5"
              >
                Retry last question
              </button>
            )}

            {messages.length === 1 && !sending && (
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => send(recruiterSummaryAction.prompt)}
                  className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-signal/40 bg-signal/10 px-3 py-2.5 text-[13px] font-medium text-surface-foreground transition-colors hover:bg-signal/15"
                >
                  {recruiterSummaryAction.label}
                  <span className="text-[11px] text-surface-foreground/60">30-second overview</span>
                </button>

                <div>
                  <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-surface-foreground/40">
                    I’m here as
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {visitorIntents.map((intent) => (
                      <button
                        key={intent.label}
                        type="button"
                        onClick={() => send(intent.prompt)}
                        className="rounded-full border border-hairline px-2.5 py-1.5 text-[12px] text-surface-foreground/70 transition-colors hover:bg-white/5 hover:text-surface-foreground"
                      >
                        {intent.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {suggestedPrompts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => send(p)}
                      className="rounded-full border border-hairline px-2.5 py-1.5 text-left text-[12px] text-surface-foreground/70 transition-colors hover:bg-white/5 hover:text-surface-foreground"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="border-t border-hairline px-3 pt-3 pb-2"
          >
            <div className="flex items-end gap-2">
              <label htmlFor="assistant-input" className="sr-only">
                Your question
              </label>
              <textarea
                id="assistant-input"
                ref={textareaRef}
                rows={1}
                value={input}
                maxLength={MAX_CHARS}
                disabled={sending}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Ask a question…"
                className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-hairline bg-white/5 px-3 py-2.5 text-[14px] text-surface-foreground placeholder:text-surface-foreground/40 focus:border-signal/60 focus:outline-none disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => (recording ? stopRecording() : void startRecording())}
                disabled={sending || transcribing}
                aria-label={recording ? "Stop recording" : "Ask by voice"}
                className={cn(
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-hairline transition-colors disabled:opacity-40",
                  recording
                    ? "border-signal/60 bg-signal/15 text-signal"
                    : "text-surface-foreground/70 hover:bg-white/5 hover:text-surface-foreground",
                )}
              >
                {recording ? <Square className="size-3.5" /> : <Mic className="size-4" />}
              </button>
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Send question"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-signal text-signal-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-surface-foreground/40">
              Answers are based on Shashank's public portfolio.
            </p>

          </form>
        </div>
      )}
    </>
  );
}
