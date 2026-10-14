// Integruje aplikację z Gemini: mapuje historię rozmowy, strumieniuje odpowiedź i zamienia błędy API na komunikaty dla użytkownika.
import { GoogleGenAI } from "@google/genai";
import { chatConfig } from "@/chat/config";
import { logErrorEvent } from "@/chat/logger";
import { STREAM_ERROR_PREFIX } from "@/lib/constants";
import type { LLMMessage } from "@/chat/types";

/** Extracts a friendly user-facing error message from Google API errors. */
function parseGoogleError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "The AI assistant encountered an unexpected error.";
  }

  const msg = error.message.toLowerCase();

  if (
    msg.includes("429") ||
    msg.includes("resource_exhausted") ||
    msg.includes("quota")
  ) {
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
  const ai = new GoogleGenAI({ apiKey: chatConfig.geminiApiKey });

  const systemMessage = messages.find((m) => m.role === "system");
  const conversation = messages.filter((m) => m.role !== "system");

  const contents = conversation.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();
  const abortController = new AbortController();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let responseLength = 0;

      try {
        const response = await ai.models.generateContentStream({
          model: chatConfig.model,
          contents,
          config: {
            abortSignal: abortController.signal,
            systemInstruction: systemMessage?.content,
            maxOutputTokens: chatConfig.maxAssistantOutputTokens,
          },
        });

        for await (const chunk of response) {
          const text = chunk.text;
          if (text) {
            const remainingLength =
              chatConfig.maxAssistantMessageLength - responseLength;
            let limitedText = text.slice(0, remainingLength);

            // Avoid cutting an emoji or another surrogate pair at the limit.
            if (
              limitedText.length === remainingLength &&
              /[\uD800-\uDBFF]$/.test(limitedText)
            ) {
              limitedText = limitedText.slice(0, -1);
            }

            if (limitedText) {
              controller.enqueue(encoder.encode(limitedText));
              responseLength += limitedText.length;
            }

            if (text.length >= remainingLength) {
              abortController.abort();
              break;
            }
          }
        }
      } catch (error) {
        // Reaching the response limit is a normal end of the stream.
        if (abortController.signal.aborted) return;

        console.error("[provider] Gemini stream error:", error);
        logErrorEvent({
          ip: "server",
          type: "api_error",
          error: `Gemini stream error: ${error instanceof Error ? error.message : "An unexpected error occurred."}`,
        });
        const userError = parseGoogleError(error);
        controller.enqueue(
          encoder.encode(`${STREAM_ERROR_PREFIX}${userError}`),
        );
      } finally {
        controller.close();
      }
    },
  });
}
