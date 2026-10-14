// Zapisuje wiadomości i zdarzenia błędów chatu do lokalnych plików JSONL w sposób nieblokujący odpowiedzi API.
import fs from "fs/promises";
import path from "path";

interface ChatLogPayload {
  userMessage: string;
  assistantMessage: string;
  error?: string;
}

interface ErrorLogPayload {
  type:
    | "rate_limited"
    | "bad_request"
    | "forbidden"
    | "api_error"
    | "knowledge_error";
  error: string;
  userMessage?: string;
}

const logsDir = path.join(process.cwd(), "logs");

/** Formats current date/time to ISO-like string in Europe/Warsaw timezone (YYYY-MM-DDTHH:mm:ss) */
function getWarsawTimestamp(): string {
  return new Date()
    .toLocaleString("sv-SE", { timeZone: "Europe/Warsaw" })
    .replace(" ", "T");
}

/** Generic non-blocking append to a JSONL file in logs/ */
function appendJsonl(fileName: string, data: object): void {
  const filePath = path.join(logsDir, fileName);
  const entry =
    JSON.stringify({
      timestamp: getWarsawTimestamp(),
      ...data,
    }) + "\n";

  fs.mkdir(logsDir, { recursive: true })
    .then(() => fs.appendFile(filePath, entry, "utf-8"))
    .catch((error: unknown) => {
      const failureEntry =
        JSON.stringify({
          timestamp: getWarsawTimestamp(),
          type: "logger_error",
          error: `Failed to write to ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
        }) + "\n";

      // Try a separate file once; calling this logger again could recurse forever.
      return fs
        .appendFile(
          path.join(logsDir, "logger-error.jsonl"),
          failureEntry,
          "utf-8",
        )
        .catch(() => undefined);
    });
}

/**
 * Asynchronously logs a user question and its generated reply to logs/chat-audit.jsonl.
 */
export function logChatMessage(payload: ChatLogPayload): void {
  const { userMessage, assistantMessage, error } = payload;
  appendJsonl("chat-audit.jsonl", { userMessage, assistantMessage, error });
}

/**
 * Asynchronously logs error events (rate limits, validation failures, API errors) to logs/error-audit.jsonl
 */
export function logErrorEvent(payload: ErrorLogPayload): void {
  const { type, error, userMessage } = payload;
  appendJsonl("error-audit.jsonl", { type, error, userMessage });
}
