// Server-only Gemini integration.
// The client receives JSON Lines events, parsed in chat/stream.ts.
import "server-only";
import { GoogleGenAI } from "@google/genai";
import { getModelConfig, limits } from "@/chat/config";
import { logChatMessage, logErrorEvent } from "@/chat/logger";
import type { ChatRequestMessage, ChatStreamEvent } from "@/chat/types";

// Users get a short, readable message; the full SDK error stays in the server log.
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

  // Overload is usually temporary, so the message suggests trying again.
  if (msg.includes("503") || msg.includes("unavailable")) {
    return "The AI model is temporarily overloaded. Please try again in a moment.";
  }

  if (msg.includes("404") || msg.includes("not_found")) {
    return "The configured AI model is unavailable.";
  }

  if (msg.includes("403") || msg.includes("permission_denied")) {
    return "Invalid API key or unauthorized access to AI model.";
  }

  return "The AI assistant encountered an error while generating the response.";
}

export function streamChat(
  messages: ChatRequestMessage[],
  systemPrompt: string,
): ReadableStream<Uint8Array> {
  const modelConfig = getModelConfig();
  const ai = new GoogleGenAI({ apiKey: modelConfig.apiKey });

  // Only the latest question is logged, not the whole history sent by the client.
  const userMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user")?.content;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();
  const abortController = new AbortController();

  // Returned right away; start() keeps pushing events as Gemini sends them.
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let responseLength = 0;
      let assistantMessage = "";
      let responseError: string | undefined;
      const sendEvent = (event: ChatStreamEvent) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        // HTTP errors such as 503 are thrown here, before any text is sent.
        const response = await ai.models.generateContentStream({
          model: modelConfig.model,
          contents,
          config: {
            abortSignal: abortController.signal,
            systemInstruction: systemPrompt,
            maxOutputTokens: limits.maxAssistantOutputTokens,
          },
        });

        // Errors during generation are thrown from this loop,
        // after part of the reply has already been sent.
        for await (const chunk of response) {
          const text = chunk.text;
          if (text) {
            // The reply must fit the assistant history limit in
            // validate-request.ts, or the next request would be rejected.
            const remainingLength =
              limits.maxAssistantMessageLength - responseLength;
            let limitedText = text.slice(0, remainingLength);

            // Don't cut an emoji in half: drop a trailing high surrogate.
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

            // Stop Gemini from generating more. This is a normal end,
            // so no error event is sent.
            if (text.length >= remainingLength) {
              abortController.abort();
              break;
            }
          }
        }
      } catch (error) {
        // The SDK may throw after our own abort. That is the
        // expected end of a capped reply, not an error.
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
        // Also runs after the early return above. An empty reply
        // without an error is still logged as a problem.
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
