import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateChatRequest } from "@/lib/security/validate-chat-request";
import { getMockAnswer } from "./mocks";

/**
 * POST /api/chat
 *
 * Accepts a chat request, validates it, and returns a mock assistant response.
 * Real LLM provider integration is deferred to the next implementation step.
 *
 * Response shape is designed to be forward-compatible with streaming:
 *   { message: { role: "assistant", content: string } }
 *
 * Future streaming path will replace the JSON response with a ReadableStream
 * (e.g. using the Vercel AI SDK or a manual SSE stream). The client can
 * detect streaming by checking the Content-Type header for "text/event-stream".
 */
export async function POST(request: NextRequest) {
  // 1. Check if chat is enabled via environment variable (defaults to true)
  const chatEnabled = process.env.CHAT_ENABLED !== "false";
  if (!chatEnabled) {
    return NextResponse.json(
      { error: "Chat service is temporarily disabled." },
      { status: 503 }
    );
  }

  try {
    // 2. Read headers (async in Next.js App Router)
    const headersList = await headers();
    const clientIp =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    // Suppress unused-variable warning — IP will be used for rate limiting in a later step
    void clientIp;

    // 3. Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    // 4. Validate structure and limits
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 5. Extract conversation — safe to cast after validation
    const { messages } = body as { messages: Array<{ role: string; content: string }> };

    // Retrieve the last user message for the mock answer
    const lastUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    // 6. Return mock assistant response
    //    This will be replaced by a real LLM call in the next implementation step.
    const content = getMockAnswer(lastUserMessage);

    return NextResponse.json({
      message: {
        role: "assistant",
        content,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[/api/chat] Unhandled error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
