import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GenerateContentParameters } from "@google/genai";
import { limits } from "@/chat/config";
import { streamChat } from "@/chat/model/provider";
import { readChatStream } from "@/chat/stream";
import type { ChatRequestMessage, ChatStreamEvent } from "@/chat/types";

const mocks = vi.hoisted(() => ({
  generateContentStream:
    vi.fn<
      (
        parameters: GenerateContentParameters,
      ) => Promise<AsyncIterable<{ text: string }>>
    >(),
  logChatMessage: vi.fn<typeof import("@/chat/logger").logChatMessage>(),
  logErrorEvent: vi.fn<typeof import("@/chat/logger").logErrorEvent>(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContentStream: mocks.generateContentStream };
  },
}));

vi.mock("@/chat/logger", () => ({
  logChatMessage: mocks.logChatMessage,
  logErrorEvent: mocks.logErrorEvent,
}));

const messages: ChatRequestMessage[] = [
  { role: "user", content: "What is your main stack?" },
  { role: "assistant", content: "I use TypeScript." },
  { role: "user", content: "Which frontend library do you use?" },
];
const userMessage = messages[2].content;
const systemPrompt = "Answer questions about the portfolio.";

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("GEMINI_API_KEY", "test-api-key");
  vi.stubEnv("LLM_MODEL", "test-model");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

async function* responseChunks(texts: string[]) {
  for (const text of texts) yield { text };
}

async function collectEvents(
  stream: ReadableStream<Uint8Array>,
): Promise<ChatStreamEvent[]> {
  const events: ChatStreamEvent[] = [];
  for await (const event of readChatStream(stream)) events.push(event);
  return events;
}

describe("streamChat", () => {
  it("passes the prompt and history to Gemini, streams text and logs the reply", async () => {
    mocks.generateContentStream.mockResolvedValue(
      responseChunks(["I use ", "React."]),
    );

    const events = await collectEvents(streamChat(messages, systemPrompt));

    expect(mocks.generateContentStream).toHaveBeenCalledExactlyOnceWith({
      model: "test-model",
      contents: [
        { role: "user", parts: [{ text: messages[0].content }] },
        { role: "model", parts: [{ text: messages[1].content }] },
        { role: "user", parts: [{ text: userMessage }] },
      ],
      config: {
        abortSignal: expect.any(AbortSignal),
        systemInstruction: systemPrompt,
        maxOutputTokens: limits.maxAssistantOutputTokens,
      },
    });
    expect(events).toEqual([
      { type: "text", content: "I use " },
      { type: "text", content: "React." },
    ]);
    expect(mocks.logChatMessage).toHaveBeenCalledExactlyOnceWith({
      userMessage,
      assistantMessage: "I use React.",
      error: undefined,
    });
    expect(mocks.logErrorEvent).not.toHaveBeenCalled();
  });

  it("caps the reply without splitting an emoji or emitting an error", async () => {
    const prefix = "a".repeat(limits.maxAssistantMessageLength - 1);
    mocks.generateContentStream.mockResolvedValue(
      responseChunks([prefix, "😀 beyond the limit", "Must not be sent"]),
    );

    const events = await collectEvents(streamChat(messages, systemPrompt));

    expect(events).toEqual([{ type: "text", content: prefix }]);
    expect(
      mocks.generateContentStream.mock.calls[0][0].config?.abortSignal?.aborted,
    ).toBe(true);
    expect(mocks.logChatMessage).toHaveBeenCalledExactlyOnceWith({
      userMessage,
      assistantMessage: prefix,
      error: undefined,
    });
    expect(mocks.logErrorEvent).not.toHaveBeenCalled();
  });

  it("emits a friendly provider error and logs the partial reply", async () => {
    const partialReply = "I mainly work with ";
    const failure = new Error("429 RESOURCE_EXHAUSTED: test provider details");
    const userError =
      "The AI provider is currently rate-limited by Google API quota. Please try again in a moment.";
    mocks.generateContentStream.mockResolvedValue(
      (async function* () {
        yield { text: partialReply };
        throw failure;
      })(),
    );

    const events = await collectEvents(streamChat(messages, systemPrompt));

    expect(events).toEqual([
      { type: "text", content: partialReply },
      { type: "error", message: userError },
    ]);
    expect(mocks.logErrorEvent).toHaveBeenCalledExactlyOnceWith({
      type: "api_error",
      error: `Gemini stream error: ${failure.message}`,
      userMessage,
    });
    expect(mocks.logChatMessage).toHaveBeenCalledExactlyOnceWith({
      userMessage,
      assistantMessage: partialReply,
      error: userError,
    });
  });

  it("emits an overload message when Gemini responds with 503", async () => {
    const failure = new Error(
      '{"error":{"code":503,"message":"This model is currently experiencing high demand.","status":"UNAVAILABLE"}}',
    );
    const userError =
      "The AI model is temporarily overloaded. Please try again in a moment.";
    mocks.generateContentStream.mockRejectedValue(failure);

    const events = await collectEvents(streamChat(messages, systemPrompt));

    expect(events).toEqual([{ type: "error", message: userError }]);
    expect(mocks.logChatMessage).toHaveBeenCalledExactlyOnceWith({
      userMessage,
      assistantMessage: "",
      error: userError,
    });
  });
});
