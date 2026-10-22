// Testy loggera (2): zapis do pliku z datą Warszawy i usuwanie plików starszych niż okres przechowywania.

import fs from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { limits } from "@/chat/config";

let tempDir: string;
let logsDir: string;
let logger: typeof import("@/chat/logger");

beforeEach(async () => {
  // Logger zapisuje w katalogu tymczasowym, a nie w logs/ projektu.
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "logger-test-"));
  logsDir = path.join(tempDir, "logs");
  vi.spyOn(process, "cwd").mockReturnValue(tempDir);
  // Podmieniamy tylko zegar, aby operacje na plikach działały normalnie.
  vi.useFakeTimers({ toFake: ["Date"] });
  // Wczytuje moduł ponownie, aby ścieżka logów i dzień czyszczenia nie przechodziły między testami.
  vi.resetModules();
  logger = await import("@/chat/logger");
});

afterEach(async () => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  await fs.rm(tempDir, { recursive: true, force: true });
});

describe("logger", () => {
  // Sprawdza datę w nazwie pliku według czasu Warszawy, aby wpis tuż po północy trafił do właściwego dnia.
  it("appends entries to a file named with the Warsaw date", async () => {
    vi.setSystemTime(new Date("2026-01-01T23:30:00Z"));

    logger.logErrorEvent({ type: "bad_request", error: "Invalid JSON" });

    const filePath = path.join(logsDir, "error-audit-2026-01-02.jsonl");
    await vi.waitFor(() => fs.access(filePath));
    const entry = JSON.parse(await fs.readFile(filePath, "utf-8"));
    expect(entry).toMatchObject({
      timestamp: "2026-01-02T00:30:00",
      type: "bad_request",
      error: "Invalid JSON",
    });
  });

  // Sprawdza usuwanie wygasłych plików dziennych, aby logi nie rosły bez końca, oraz pozostawienie pozostałych plików.
  it("removes dated log files older than the retention period", async () => {
    const now = new Date("2026-06-15T12:00:00Z");
    vi.setSystemTime(now);
    const expiredDate = new Date(
      now.getTime() - (limits.logRetentionDays + 1) * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .slice(0, 10);

    await fs.mkdir(logsDir);
    const expiredFile = `chat-audit-${expiredDate}.jsonl`;
    const keptFiles = ["chat-audit-2026-06-01.jsonl", "chat-audit.jsonl"];
    for (const file of [expiredFile, ...keptFiles]) {
      await fs.writeFile(path.join(logsDir, file), "{}\n");
    }

    logger.logChatMessage({ userMessage: "Hi", assistantMessage: "Hello" });

    await vi.waitFor(async () => {
      expect(await fs.readdir(logsDir)).not.toContain(expiredFile);
    });
    expect((await fs.readdir(logsDir)).sort()).toEqual(
      [...keptFiles, "chat-audit-2026-06-15.jsonl"].sort(),
    );
  });
});
