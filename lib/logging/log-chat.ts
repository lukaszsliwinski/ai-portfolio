import fs from "fs/promises";
import path from "path";

interface ChatLogPayload {
  ip: string;
  userMessage: string;
}

interface ErrorLogPayload {
  ip: string;
  type: "rate_limited" | "bad_request" | "forbidden" | "api_error";
  error: string;
  userMessage?: string;
}

const logsDir = path.join(process.cwd(), "logs");

/** Formats current date/time to ISO-like string in Europe/Warsaw timezone (YYYY-MM-DDTHH:mm:ss) */
function getWarsawTimestamp(): string {
  return new Date().toLocaleString("sv-SE", { timeZone: "Europe/Warsaw" }).replace(" ", "T");
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
    .catch((err) => console.error(`[logger] Failed to write to ${fileName}:`, err));
}

/**
 * Asynchronously logs valid user chat messages to logs/chat-audit.jsonl
 */
export function logChatMessage(payload: ChatLogPayload): void {
  appendJsonl("chat-audit.jsonl", payload);
}

/**
 * Asynchronously logs error events (rate limits, validation failures, API errors) to logs/error-audit.jsonl
 */
export function logErrorEvent(payload: ErrorLogPayload): void {
  appendJsonl("error-audit.jsonl", payload);
}
