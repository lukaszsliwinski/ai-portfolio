// Zapisywanie historii rozmów oraz błędów w katalogu /logs, w osobnym pliku na każdy dzień.
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

// Dzień ostatniego czyszczenia; nowy dzień uruchamia je przy pierwszym wpisie.
let lastCleanupDate: string | undefined;

// Czas wpisów jest liczony dla Warszawy, niezależnie od strefy czasowej serwera.
function getWarsawTimestamp(date = new Date()): string {
  return date
    .toLocaleString("sv-SE", { timeZone: "Europe/Warsaw" })
    .replace(" ", "T");
}

// Usuwa pliki dzienne starsze niż okres przechowywania; pliki bez daty w nazwie pozostają.
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

// Awarię zgłaszamy raz do pliku awaryjnego, bez ponownego wywoływania loggera.
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

// Zapis do pliku JSONL z datą w nazwie, np. chat-audit-2026-01-31.jsonl.
function appendJsonl(baseName: string, data: object): void {
  const timestamp = getWarsawTimestamp();
  const date = timestamp.slice(0, 10);
  const fileName = `${baseName}-${date}.jsonl`;
  const entry = JSON.stringify({ timestamp, ...data }) + "\n";

  // Decyzja zapada od razu, aby równoległe wpisy nie uruchomiły czyszczenia kilka razy.
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

// Jeden wpis łączy ostatnie pytanie z odpowiedzią, także częściową przy błędzie.
export function logChatMessage(payload: ChatLogPayload): void {
  const { userMessage, assistantMessage, error } = payload;
  appendJsonl("chat-audit", { userMessage, assistantMessage, error });
}

// Jawny wybór pól ogranicza wpis do rodzaju błędu, opisu i opcjonalnego pytania.
export function logErrorEvent(payload: ErrorLogPayload): void {
  const { type, error, userMessage } = payload;
  appendJsonl("error-audit", { type, error, userMessage });
}
