// JSON Lines audit logs, one file per day, in /logs (a host volume in Docker).
import fs from "fs/promises";
import path from "path";
import { limits } from "@/chat/config";

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
const retentionMs = limits.logRetentionDays * 24 * 60 * 60 * 1000;
const datedLogPattern = /-(\d{4}-\d{2}-\d{2})\.jsonl$/;

// The first write of a new day triggers a cleanup.
let lastCleanupDate: string | undefined;

// Warsaw time regardless of the server's time zone.
// The sv-SE locale happens to produce a sortable YYYY-MM-DD HH:mm:ss format.
function getWarsawTimestamp(date = new Date()): string {
  return date
    .toLocaleString("sv-SE", { timeZone: "Europe/Warsaw" })
    .replace(" ", "T");
}

// Only files with a date in the name are removed; nothing else in /logs is touched.
async function removeExpiredLogs(): Promise<void> {
  const cutoffDate = getWarsawTimestamp(
    new Date(Date.now() - retentionMs),
  ).slice(0, 10);
  const files = await fs.readdir(logsDir);

  await Promise.all(
    files
      .filter((file) => {
        const fileDate = datedLogPattern.exec(file)?.[1];
        return fileDate !== undefined && fileDate < cutoffDate;
      })
      .map((file) => fs.unlink(path.join(logsDir, file))),
  );
}

// Written directly, not through appendJsonl, so a failing disk can't cause a loop.
function reportLoggerFailure(
  message: string,
  error: unknown,
  date: string,
): Promise<void> {
  const failureEntry =
    JSON.stringify({
      timestamp: getWarsawTimestamp(),
      type: "logger_error",
      error: `${message}: ${error instanceof Error ? error.message : String(error)}`,
    }) + "\n";

  return fs
    .appendFile(
      path.join(logsDir, `logger-error-${date}.jsonl`),
      failureEntry,
      "utf-8",
    )
    .catch(() => undefined);
}

// e.g. chat-audit-2026-01-31.jsonl.
// Fire-and-forget, so logging never delays a response.
function appendJsonl(baseName: string, data: object): void {
  const timestamp = getWarsawTimestamp();
  const date = timestamp.slice(0, 10);
  const fileName = `${baseName}-${date}.jsonl`;
  const entry = JSON.stringify({ timestamp, ...data }) + "\n";

  // Decided synchronously, so concurrent writes don't start the cleanup twice.
  const shouldCleanUp = lastCleanupDate !== date;
  lastCleanupDate = date;

  fs.mkdir(logsDir, { recursive: true })
    .then(() => fs.appendFile(path.join(logsDir, fileName), entry, "utf-8"))
    .catch((error: unknown) =>
      reportLoggerFailure(`Failed to write to ${fileName}`, error, date),
    )
    .then(() => {
      if (!shouldCleanUp) return;
      return removeExpiredLogs().catch((error: unknown) =>
        reportLoggerFailure("Failed to remove expired logs", error, date),
      );
    });
}

// One entry per question, including replies cut off by an error.
export function logChatMessage(payload: ChatLogPayload): void {
  const { userMessage, assistantMessage, error } = payload;
  appendJsonl("chat-audit", { userMessage, assistantMessage, error });
}

// Fields are picked explicitly, so nothing unexpected ends up in the log.
export function logErrorEvent(payload: ErrorLogPayload): void {
  const { type, error, userMessage } = payload;
  appendJsonl("error-audit", { type, error, userMessage });
}
