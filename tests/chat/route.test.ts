import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/chat/route";
import type { ChatRequestMessage } from "@/chat/types";

const mocks = vi.hoisted(() => ({
  createChatStream: vi.fn<typeof import("@/chat/service").createChatStream>(),
  checkRateLimit:
    vi.fn<typeof import("@/chat/security/rate-limit").checkRateLimit>(),
  logChatMessage: vi.fn<typeof import("@/chat/logger").logChatMessage>(),
  logErrorEvent: vi.fn<typeof import("@/chat/logger").logErrorEvent>(),
}));

vi.mock("@/chat/service", () => ({
  createChatStream: mocks.createChatStream,
}));

vi.mock("@/chat/security/rate-limit", () => ({
  checkRateLimit: mocks.checkRateLimit,
}));

vi.mock("@/chat/logger", () => ({
  logChatMessage: mocks.logChatMessage,
  logErrorEvent: mocks.logErrorEvent,
}));

const messages: ChatRequestMessage[] = [
  { role: "user", content: "What is your main stack?" },
];

function createRequest(body: unknown): NextRequest {
  return new NextRequest("https://portfolio.test/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "https://portfolio.test",
      host: "portfolio.test",
      "x-forwarded-for": "192.0.2.1",
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.checkRateLimit.mockReturnValue({ success: true, resetSeconds: 3600 });
});

describe("POST /api/chat", () => {
  it("returns the service stream with status 200 and the NDJSON content type", async () => {
    const body =
      JSON.stringify({ type: "text", content: "I use React." }) + "\n";
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(body));
        controller.close();
      },
    });
    mocks.createChatStream.mockResolvedValue(stream);

    const response = await POST(createRequest({ messages }));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/x-ndjson; charset=utf-8",
    );
    expect(response.body).toBe(stream);
    expect(await response.text()).toBe(body);
    expect(mocks.createChatStream).toHaveBeenCalledExactlyOnceWith(messages);
    expect(mocks.logErrorEvent).not.toHaveBeenCalled();
  });

  // Uses the real validator, not a mock.
  it("rejects invalid messages with status 400 before starting generation", async () => {
    const response = await POST(createRequest({ messages: [] }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toEqual(expect.stringMatching(/\S/));
    expect(mocks.createChatStream).not.toHaveBeenCalled();
    expect(mocks.logErrorEvent).toHaveBeenCalledExactlyOnceWith({
      type: "bad_request",
      error: body.error,
    });
  });

  it("returns status 429 and Retry-After when the IP limit is exhausted", async () => {
    mocks.checkRateLimit.mockReturnValue({ success: false, resetSeconds: 90 });

    const response = await POST(createRequest({ messages }));
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("90");
    expect(body.error).toEqual(expect.stringMatching(/\S/));
    expect(mocks.checkRateLimit).toHaveBeenCalledExactlyOnceWith("192.0.2.1");
    expect(mocks.createChatStream).not.toHaveBeenCalled();
    expect(mocks.logErrorEvent).toHaveBeenCalledExactlyOnceWith({
      type: "rate_limited",
      error: body.error,
    });
  });

  // Internal error details must not leak to the client.
  it("returns a generic 500 response while logging the setup failure", async () => {
    const failure = new Error("Cannot load knowledge from /private/test-data");
    mocks.createChatStream.mockRejectedValue(failure);

    const response = await POST(createRequest({ messages }));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Something went wrong. Please try again later.",
    });
    expect(mocks.logErrorEvent).toHaveBeenCalledExactlyOnceWith({
      type: "api_error",
      error: failure.message,
      userMessage: messages[0].content,
    });
    expect(mocks.logChatMessage).toHaveBeenCalledExactlyOnceWith({
      userMessage: messages[0].content,
      assistantMessage: "",
      error: failure.message,
    });
  });
});
