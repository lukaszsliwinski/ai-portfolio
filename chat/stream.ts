import type { ChatStreamEvent } from "./types";

function parseEvent(line: string): ChatStreamEvent {
  const event: unknown = JSON.parse(line);

  if (typeof event === "object" && event !== null && "type" in event) {
    if (
      event.type === "text" &&
      "content" in event &&
      typeof event.content === "string"
    ) {
      return { type: "text", content: event.content };
    }

    if (
      event.type === "error" &&
      "message" in event &&
      typeof event.message === "string"
    ) {
      return { type: "error", message: event.message };
    }
  }

  throw new Error("Invalid chat stream event.");
}

/** Reads complete JSON Lines events, regardless of network chunk boundaries. */
export async function* readChatStream(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<ChatStreamEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += done
        ? decoder.decode()
        : decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        if (line) yield parseEvent(line);
      }

      if (done) {
        // Accept a complete final event even if the last newline was omitted.
        if (buffer.trim()) yield parseEvent(buffer);
        return;
      }
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
