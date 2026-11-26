import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type ChatRole = "user" | "assistant";

export type AssistantReply = {
  status: "ok" | "unconfigured" | "error" | "rate_limited";
  message: string;
};

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(1000),
      }),
    )
    .min(1)
    .max(12),
});

export const askPortfolioAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }): Promise<AssistantReply> => {
    const {
      buildSystemPrompt,
      checkRateLimit,
      MAX_HISTORY_MESSAGES,
      MAX_MESSAGE_CHARS,
    } = await import("./portfolio-assistant.server");

    const apiKey = process.env["GROQ_API_KEY"];
    if (!apiKey) {
      return {
        status: "unconfigured",
        message:
          "The assistant isn't connected yet. Add the GROQ_API_KEY secret in this project's settings to enable live answers. In the meantime, browse the portfolio sections or email radiant.shashankshekhar@gmail.com.",
      };
    }

    // Lightweight per-caller guard (no auth system required).
    let rateKey = "anonymous";
    try {
      const { getRequest } = await import("@tanstack/react-start/server");
      const request = getRequest();
      rateKey =
        request.headers.get("cf-connecting-ip") ??
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "anonymous";
    } catch {
      // Request context unavailable; fall back to a shared bucket.
    }

    const limit = checkRateLimit(rateKey);
    if (!limit.ok) {
      return {
        status: "rate_limited",
        message: `That's a lot of questions at once. Please try again in about ${limit.retryAfterSeconds} seconds.`,
      };
    }

    const history = data.messages
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

    const configuredModel = process.env["GROQ_MODEL"]?.trim();
    const fallbackModel = "openai/gpt-oss-120b";
    const model = configuredModel || fallbackModel;

    try {
      const requestGroq = (requestedModel: string) =>
        fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: requestedModel,
            temperature: 0.2,
            max_tokens: 700,
            messages: [{ role: "system", content: buildSystemPrompt() }, ...history],
          }),
        });

      let response = await requestGroq(model);
      if (response.status === 404 && model !== fallbackModel) {
        const unavailableModelDetail = await response.text();
        console.warn(
          `Configured Groq model is unavailable; using fallback model. ${unavailableModelDetail.slice(0, 200)}`,
        );
        response = await requestGroq(fallbackModel);
      }

      if (!response.ok) {
        const detail = await response.text();
        console.error(`Groq request failed: ${response.status} ${detail.slice(0, 300)}`);
        return {
          status: "error",
          message:
            response.status === 429
              ? "The assistant is rate limited right now. Please try again in a moment."
              : "The assistant couldn't reach the AI service. Please try again.",
        };
      }

      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = payload.choices?.[0]?.message?.content?.trim();
      if (!text) {
        return {
          status: "error",
          message: "The assistant returned an empty response. Please try asking again.",
        };
      }
      return { status: "ok", message: text };
    } catch (error) {
      console.error("Portfolio assistant request error", error);
      return {
        status: "error",
        message: "Something went wrong reaching the assistant. Please try again.",
      };
    }
  });
