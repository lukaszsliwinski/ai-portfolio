// Parses the chat response in the browser. The server sends JSON Lines, but network
// chunks don't line up with lines, so text is buffered and split here.
import type { ChatStreamEvent } from "./types";

// Validates the event shape before the UI touches it.
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

// A single read can contain part of an event or several complete lines.
export async function* readChatStream(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<ChatStreamEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      // stream: true holds back a multi-byte character (e.g. "ł" or an emoji) split
      // across chunks until the rest arrives; the final decode() flushes it.
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
        // Accept a final event even without a trailing newline.
        if (buffer.trim()) yield parseEvent(buffer);
        return;
      }
    }
  } finally {
    // Also runs when the consumer leaves the loop early (e.g. after an error
    // event), so the connection is always closed.
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
