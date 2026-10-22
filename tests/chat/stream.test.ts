import { describe, expect, it, vi } from "vitest";
import { readChatStream } from "@/chat/stream";
import type { ChatStreamEvent } from "@/chat/types";

const encoder = new TextEncoder();

function streamFromChunks(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
}

async function collectEvents(
  stream: ReadableStream<Uint8Array>,
): Promise<ChatStreamEvent[]> {
  const events: ChatStreamEvent[] = [];
  for await (const event of readChatStream(stream)) events.push(event);
  return events;
}

describe("readChatStream", () => {
  it("reads multiple newline-separated events in one chunk", async () => {
    const events: ChatStreamEvent[] = [
      { type: "text", content: "Hello" },
      { type: "error", message: "The provider is unavailable." },
    ];
    const text = events.map((event) => JSON.stringify(event)).join("\n");

    await expect(
      collectEvents(streamFromChunks([encoder.encode(text + "\n")])),
    ).resolves.toEqual(events);
  });

  // A network chunk can end inside the JSON or inside a multi-byte character.
  it("preserves JSON and Unicode across every possible byte split", async () => {
    const event: ChatStreamEvent = { type: "text", content: "Zażółć 😀" };
    const bytes = encoder.encode(JSON.stringify(event) + "\n");

    for (let split = 1; split < bytes.length; split++) {
      const stream = streamFromChunks([
        bytes.slice(0, split),
        bytes.slice(split),
      ]);
      expect(await collectEvents(stream)).toEqual([event]);
    }
  });

  it("accepts an empty stream", async () => {
    await expect(collectEvents(streamFromChunks([]))).resolves.toEqual([]);
  });

  it("propagates network read failures and releases the stream lock", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.error(new Error("Connection lost"));
      },
    });

    await expect(collectEvents(stream)).rejects.toThrow("Connection lost");
    expect(stream.locked).toBe(false);
  });

  // The UI leaves the loop early after an error event.
  it("cancels the source when the consumer stops reading early", async () => {
    const cancel = vi.fn();
    const event: ChatStreamEvent = { type: "text", content: "First fragment" };
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      },
      cancel,
    });

    for await (const received of readChatStream(stream)) {
      expect(received).toEqual(event);
      break;
    }

    expect(cancel).toHaveBeenCalledOnce();
    expect(stream.locked).toBe(false);
  });
});
