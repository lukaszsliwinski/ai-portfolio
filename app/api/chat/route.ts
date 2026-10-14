// Obsługuje endpoint POST chatu: zabezpiecza i waliduje żądanie, pilnuje limitów oraz zwraca strumień odpowiedzi Gemini.
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateChatRequest } from "@/chat/security/validate-request";
import { checkRateLimit } from "@/chat/security/rate-limit";
import { createChatStream } from "@/chat/service";
import { logChatMessage, logErrorEvent } from "@/chat/logger";

/** Formats seconds into human-readable hours and minutes rounded up. */
function formatWaitTime(totalSeconds: number): string {
  const totalMinutes = Math.max(1, Math.ceil(totalSeconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  return `${hours} ${hours === 1 ? "hour" : "hours"} ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

/**
 * POST /api/chat
 *
 * Validates request, checks Same-Origin & Rate Limits,
 * constructs system prompt, and streams Gemini response.
 */
export async function POST(request: NextRequest) {
  let userMessage: string | undefined;

  try {
    const headersList = await headers();
    const clientIp =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headersList.get("x-real-ip") ||
      "127.0.0.1";

    // Same-Origin Guard: block cross-origin browser requests
    const origin = headersList.get("origin");
    const host = headersList.get("host");
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          logErrorEvent({
            type: "forbidden",
            error: "Cross-origin request blocked",
          });
          return NextResponse.json(
            { error: "Forbidden: Cross-origin requests are not allowed." },
            { status: 403 },
          );
        }
      } catch {
        // Ignore invalid origin format
      }
    }

    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.success) {
      const waitTimeText = formatWaitTime(rateLimit.resetSeconds);
      const errMsg = `Message limit reached for your IP address. Please wait ${waitTimeText} before sending another message.`;
      logErrorEvent({ type: "rate_limited", error: errMsg });
      return NextResponse.json(
        { error: errMsg },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
          },
        },
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      logErrorEvent({
        type: "bad_request",
        error: "Invalid JSON in request body",
      });
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 },
      );
    }

    // Validate structure and limits
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      logErrorEvent({
        type: "bad_request",
        error: validation.error || "Validation failed",
      });
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { messages } = validation.data;

    // Keep the question available if setup fails before the provider starts.
    userMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user")?.content;

    // Build the knowledge-grounded prompt and stream the Gemini response
    const stream = await createChatStream(messages);

    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    logErrorEvent({ type: "api_error", error: message, userMessage });
    if (userMessage) {
      logChatMessage({ userMessage, assistantMessage: "", error: message });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
