import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type TranscriptionReply = {
  status: "ok" | "unconfigured" | "error";
  text?: string;
  message?: string;
};

// ~1.4MB of base64 ≈ 1MB of audio; plenty for a short spoken question.
const MAX_BASE64_CHARS = 1_400_000;

const TranscribeInput = z.object({
  audioBase64: z.string().min(100).max(MAX_BASE64_CHARS),
  mimeType: z.string().min(3).max(80),
});

const EXTENSIONS: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
};

export const transcribeQuestion = createServerFn({ method: "POST" })
  .validator((input: unknown) => TranscribeInput.parse(input))
  .handler(async ({ data }): Promise<TranscriptionReply> => {
    const apiKey = process.env["GROQ_API_KEY"];
    if (!apiKey) {
      return {
        status: "unconfigured",
        message:
          "Voice input isn't connected yet. Add the GROQ_API_KEY secret in this project's settings to enable it.",
      };
    }

    const baseMime = data.mimeType.split(";")[0]!.trim().toLowerCase();
    const extension = EXTENSIONS[baseMime];
    if (!extension) {
      return { status: "error", message: "That audio format isn't supported. Please type instead." };
    }

    try {
      const bytes = Buffer.from(data.audioBase64, "base64");
      if (bytes.byteLength < 2048) {
        return { status: "error", message: "That recording was too short — please try again." };
      }

      const form = new FormData();
      form.append("model", "whisper-large-v3-turbo");
      form.append("response_format", "json");
      form.append("file", new Blob([new Uint8Array(bytes)], { type: baseMime }), `question.${extension}`);

      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { authorization: `Bearer ${apiKey}` },
        body: form,
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error(`Groq transcription failed: ${response.status} ${detail.slice(0, 300)}`);
        return {
          status: "error",
          message:
            response.status === 429
              ? "Voice input is rate limited right now. Please try again in a moment."
              : "Couldn't transcribe that recording. Please try again or type your question.",
        };
      }

      const payload = (await response.json()) as { text?: string };
      const text = payload.text?.trim();
      if (!text) {
        return { status: "error", message: "I didn't catch that — please try again." };
      }
      return { status: "ok", text };
    } catch (error) {
      console.error("Transcription request error", error);
      return { status: "error", message: "Something went wrong with voice input. Please try again." };
    }
  });
