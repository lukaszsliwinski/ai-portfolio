import { GoogleGenAI } from "@google/genai";

const MODEL = process.env.LLM_MODEL ?? "gemini-3.1-flash-lite";

type LLMMessage = { role: string; content: string };

/**
 * Sentinel prefix written into stream when Gemini API encounters an error.
 */
export const STREAM_ERROR_PREFIX = "__STREAM_ERROR__:";

/** Extracts a friendly user-facing error message from Google API errors. */
function parseGoogleError(error: unknown): string {
  if (!(error instanceof Error)) return "The AI assistant encountered an unexpected error.";

  const msg = error.message.toLowerCase();
  if (msg.includes("429") || msg.includes("resource_exhausted") || msg.includes("quota")) {
    return "The AI provider is currently rate-limited by Google API quota. Please try again in a moment.";
  }
  if (msg.includes("404") || msg.includes("not_found")) {
    return "The configured AI model is unavailable.";
  }
  if (msg.includes("403") || msg.includes("permission_denied")) {
    return "Invalid API key or unauthorized access to AI model.";
  }

  return "The AI assistant encountered an error while generating the response.";
}

/**
 * Streams a chat response from Gemini.
 * Emits STREAM_ERROR_PREFIX sentinel line on error instead of throwing uncaught stream error.
 */
export function streamChat(messages: LLMMessage[]): ReadableStream<Uint8Array> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const ai = new GoogleGenAI({ apiKey });

  const systemMessage = messages.find((m) => m.role === "system");
  const conversation = messages.filter((m) => m.role !== "system");

  const contents = conversation.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const response = await ai.models.generateContentStream({
          model: MODEL,
          contents,
          config: {
            systemInstruction: systemMessage?.content,
            maxOutputTokens: 800,
          },
        });

        for await (const chunk of response) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (error) {
        console.error("[provider] Gemini stream error:", error);
        const userError = parseGoogleError(error);
        controller.enqueue(encoder.encode(`${STREAM_ERROR_PREFIX}${userError}`));
      } finally {
        controller.close();
      }
    },
  });
}
