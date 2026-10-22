// Testy limitera (4): blokada po wyczerpaniu limitu, niezależność IP i odnowienie limitu.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { limits } from "@/chat/config";

const startTime = new Date("2026-01-01T00:00:00Z");
const windowMs = limits.rateLimitWindowHours * 60 * 60 * 1000;
let checkRateLimit: typeof import("@/chat/security/rate-limit").checkRateLimit;

beforeEach(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(startTime);
  // Wczytuje moduł ponownie, aby testy nie współdzieliły liczników zapisanych w pamięci.
  vi.resetModules();
  ({ checkRateLimit } = await import("@/chat/security/rate-limit"));
});

afterEach(() => {
  vi.useRealTimers();
});

function exhaustLimit(ip: string) {
  for (let i = 0; i < limits.rateLimitRequests; i++) checkRateLimit(ip);
}

describe("checkRateLimit", () => {
  // Sprawdza dozwoloną liczbę żądań i blokadę kolejnego, aby limit nie był przesunięty o jeden.
  it("allows the configured number of requests and blocks the next one", () => {
    for (let i = 0; i < limits.rateLimitRequests; i++) {
      expect(checkRateLimit("192.0.2.1").success).toBe(true);
    }

    expect(checkRateLimit("192.0.2.1")).toEqual({
      success: false,
      resetSeconds: Math.ceil(windowMs / 1000),
    });
  });

  // Sprawdza niezależność IP, aby wyczerpanie limitu przez jedną osobę nie blokowało pozostałych.
  it("keeps independent counters for different IP addresses", () => {
    exhaustLimit("192.0.2.1");

    expect(checkRateLimit("192.0.2.1").success).toBe(false);
    expect(checkRateLimit("192.0.2.2").success).toBe(true);
  });

  // Sprawdza odnowienie pełnej puli po upływie okna, aby blokada nie pozostawała na stałe.
  it("restores the full allowance after the window expires", () => {
    exhaustLimit("192.0.2.1");
    vi.setSystemTime(startTime.getTime() + windowMs + 1);

    for (let i = 0; i < limits.rateLimitRequests; i++) {
      expect(checkRateLimit("192.0.2.1").success).toBe(true);
    }
    expect(checkRateLimit("192.0.2.1").success).toBe(false);
  });

  // Sprawdza stały termin odnowienia, aby ponawianie żądań nie przedłużało blokady.
  it("does not extend the window when more requests arrive", () => {
    checkRateLimit("192.0.2.1");
    vi.setSystemTime(startTime.getTime() + windowMs / 2);
    exhaustLimit("192.0.2.1");
    expect(checkRateLimit("192.0.2.1").success).toBe(false);

    vi.setSystemTime(startTime.getTime() + windowMs + 1);
    expect(checkRateLimit("192.0.2.1").success).toBe(true);
  });
});
