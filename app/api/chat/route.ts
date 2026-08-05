import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateChatRequest } from "@/lib/security/validate-chat-request";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { loadKnowledge } from "@/lib/knowledge/load-knowledge";
import { formatKnowledge } from "@/lib/knowledge/format-knowledge";
import { getSystemPrompt } from "@/lib/ai/system-prompt";
import { streamChat } from "@/lib/ai/provider";

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
  // 1. Feature flag
  const chatEnabled = process.env.CHAT_ENABLED !== "false";
  if (!chatEnabled) {
    return NextResponse.json(
      { error: "Chat service is temporarily disabled." },
      { status: 503 }
    );
  }

  // 2. API key guard — fail fast
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "LLM provider is not configured. Please contact the site owner." },
      { status: 503 }
    );
  }

  try {
    const headersList = await headers();

    // 3. Same-Origin Guard (Security E): block cross-origin browser requests
    const origin = headersList.get("origin");
    const host = headersList.get("host");
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json(
            { error: "Forbidden: Cross-origin requests are not allowed." },
            { status: 403 }
          );
        }
      } catch {
        // Ignore invalid origin format
      }
    }

    // 4. Rate Limiting per IP
    const clientIp =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headersList.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.success) {
      const waitTimeText = formatWaitTime(rateLimit.resetSeconds);
      return NextResponse.json(
        {
          error: `Message limit reached for your IP address. Please wait ${waitTimeText} before sending another message.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
          },
        }
      );
    }

    // 5. Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    // 6. Validate structure and limits
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { messages } = body as {
      messages: Array<{ role: string; content: string }>;
    };

    // 7. Build knowledge-grounded system prompt
    const knowledge = await loadKnowledge();
    const systemPrompt = getSystemPrompt(formatKnowledge(knowledge));

    // 8. Assemble full message list: [system, ...conversationHistory]
    const llmMessages = [{ role: "system", content: systemPrompt }, ...messages];

    // 9. Stream response from Gemini
    const stream = streamChat(llmMessages);

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[/api/chat] Unhandled error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
