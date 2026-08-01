import { GoogleGenAI } from "@google/genai";

/**
 * Gemini LLM provider adapter.
 *
 * This file is the only place in the codebase that imports or uses @google/genai.
 * To switch providers, replace this file only — route.ts and ChatSection are unaffected.
 *
 * Expected llmMessages format:
 *   [{ role: "system", content: "..." }, { role: "user", content: "..." }, ...]
 */

const MODEL = process.env.LLM_MODEL ?? "gemini-3.1-flash-lite";

type LLMMessage = { role: string; content: string };

/**
 * Streams a chat response from Gemini.
 * Returns a ReadableStream of UTF-8 text chunks.
 *
 * Throws synchronously if GEMINI_API_KEY is not set (caller should check first).
 */
export function streamChat(messages: LLMMessage[]): ReadableStream<Uint8Array> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const ai = new GoogleGenAI({ apiKey });

  // Gemini separates system instruction from conversation history
  const systemMessage = messages.find((m) => m.role === "system");
  const conversation = messages.filter((m) => m.role !== "system");

  // Gemini uses "model" instead of "assistant" for assistant turns
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

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
