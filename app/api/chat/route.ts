import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateChatRequest } from "@/lib/security/validate-chat-request";
import { loadKnowledge } from "@/lib/knowledge/load-knowledge";
import { formatKnowledge } from "@/lib/knowledge/format-knowledge";
import { getSystemPrompt } from "@/lib/ai/system-prompt";
import { streamChat } from "@/lib/ai/provider";

/**
 * POST /api/chat
 *
 * Validates the request, builds the knowledge-grounded system prompt,
 * and streams the Gemini response token by token.
 *
 * Success response: text/plain stream (UTF-8 chunks)
 * Error responses:  application/json { error: string }
 *
 * The client distinguishes errors from streams by checking response.ok
 * before attempting to read the body as a stream.
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

  // 2. API key guard — fail fast before any expensive work
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "LLM provider is not configured. Please contact the site owner." },
      { status: 503 }
    );
  }

  try {
    // 3. Read client IP (used for rate limiting in a later step)
    const headersList = await headers();
    const clientIp =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headersList.get("x-real-ip") ||
      "unknown";
    void clientIp;

    // 4. Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    // 5. Validate structure and limits
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { messages } = body as {
      messages: Array<{ role: string; content: string }>;
    };

    // 6. Build knowledge-grounded system prompt
    const knowledge = await loadKnowledge();
    const systemPrompt = getSystemPrompt(formatKnowledge(knowledge));

    // 7. Assemble full message list: [system, ...conversationHistory]
    const llmMessages = [{ role: "system", content: systemPrompt }, ...messages];

    // 8. Stream response from Gemini
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
