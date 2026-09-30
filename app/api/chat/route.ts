import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateChatRequest } from "@/lib/security/validate-chat-request";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createChatStream } from "@/lib/chat/chat-service";
import { logChatMessage, logErrorEvent } from "@/lib/chat/logger";

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
            ip: clientIp,
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
      logErrorEvent({ ip: clientIp, type: "rate_limited", error: errMsg });
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
        ip: clientIp,
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
        ip: clientIp,
        type: "bad_request",
        error: validation.error || "Validation failed",
      });
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { messages } = validation.data;

    // Log latest user message asynchronously in background
    const lastUserMsg = [...messages]
      .reverse()
      .find((m) => m.role === "user")?.content;
    if (lastUserMsg) {
      logChatMessage({ ip: clientIp, userMessage: lastUserMsg });
    }

    // Build the knowledge-grounded prompt and stream the Gemini response
    const stream = await createChatStream(messages);

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[/api/chat] Unhandled error:", error);
    logErrorEvent({ ip: "server", type: "api_error", error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
