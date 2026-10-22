import fs from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { limits } from "@/chat/config";

let tempDir: string;
let logsDir: string;
let logger: typeof import("@/chat/logger");

beforeEach(async () => {
  // Write to a temp dir instead of the project's logs/.
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "logger-test-"));
  logsDir = path.join(tempDir, "logs");
  vi.spyOn(process, "cwd").mockReturnValue(tempDir);
  // Fake only Date, so real timers and file I/O keep working.
  vi.useFakeTimers({ toFake: ["Date"] });
  // Fresh module per test: the logs path and the last cleanup date are module state.
  vi.resetModules();
  logger = await import("@/chat/logger");
});

afterEach(async () => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  await fs.rm(tempDir, { recursive: true, force: true });
});

describe("logger", () => {
  // 23:30 UTC is already the next day in Warsaw.
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
