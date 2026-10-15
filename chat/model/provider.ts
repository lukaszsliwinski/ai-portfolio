// Integruje aplikację z Gemini: mapuje historię rozmowy, strumieniuje odpowiedź i zamienia błędy API na komunikaty dla użytkownika.
import { GoogleGenAI } from "@google/genai";
import { getModelConfig, limits } from "@/chat/config";
import { logChatMessage, logErrorEvent } from "@/chat/logger";
import type { ChatRequestMessage, ChatStreamEvent } from "@/chat/types";

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
 * Emits JSON Lines events for text and user-facing errors.
 */
export function streamChat(
  messages: ChatRequestMessage[],
  systemPrompt: string,
): ReadableStream<Uint8Array> {
  const modelConfig = getModelConfig();
  const ai = new GoogleGenAI({ apiKey: modelConfig.apiKey });

  const userMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user")?.content;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();
  const abortController = new AbortController();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let responseLength = 0;
      let assistantMessage = "";
      let responseError: string | undefined;
      const sendEvent = (event: ChatStreamEvent) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        const response = await ai.models.generateContentStream({
          model: modelConfig.model,
          contents,
          config: {
            abortSignal: abortController.signal,
            systemInstruction: systemPrompt,
            maxOutputTokens: limits.maxAssistantOutputTokens,
          },
        });

        for await (const chunk of response) {
          const text = chunk.text;
          if (text) {
            const remainingLength =
              limits.maxAssistantMessageLength - responseLength;
            let limitedText = text.slice(0, remainingLength);

            // Avoid cutting an emoji or another surrogate pair at the limit.
            if (
              limitedText.length === remainingLength &&
              /[\uD800-\uDBFF]$/.test(limitedText)
            ) {
              limitedText = limitedText.slice(0, -1);
            }

            if (limitedText) {
              sendEvent({ type: "text", content: limitedText });
              assistantMessage += limitedText;
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

        logErrorEvent({
          type: "api_error",
          error: `Gemini stream error: ${error instanceof Error ? error.message : "An unexpected error occurred."}`,
          userMessage,
        });
        const userError = parseGoogleError(error);
        responseError = userError;
        sendEvent({ type: "error", message: userError });
      } finally {
        if (userMessage) {
          logChatMessage({
            userMessage,
            assistantMessage,
            error:
              responseError ||
              (assistantMessage
                ? undefined
                : "Received an empty response from the server."),
          });
        }
        controller.close();
      }
    },
  });
}
