import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateChatRequest } from "@/lib/security/validate-chat-request";
import { loadKnowledge } from "@/lib/knowledge/load-knowledge";
import { formatKnowledge } from "@/lib/knowledge/format-knowledge";
import { getSystemPrompt } from "@/lib/ai/system-prompt";

export async function POST(request: NextRequest) {
  // 1. Check if chat is enabled
  const chatEnabled = process.env.CHAT_ENABLED !== "false";
  if (!chatEnabled) {
    return NextResponse.json(
      { error: "Chat service is temporarily disabled." },
      { status: 503 }
    );
  }

  try {
    // 2. Read headers asynchronously (required in Next.js 16)
    const headersList = await headers();
    const clientIp = headersList.get("x-forwarded-for") || "unknown";

    // 3. Parse and validate request body
    const body = await request.json();
    const validation = validateChatRequest(body);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 4. Load and format knowledge base
    const knowledgeData = await loadKnowledge();
    const formattedKnowledge = formatKnowledge(knowledgeData);

    // 5. Build system prompt (for validation/debug purposes in this step)
    const systemPrompt = getSystemPrompt(formattedKnowledge);

    // 6. Return a mock response indicating success (LLM integration is in the next step)
    const userMessages = body.messages.filter((m: any) => m.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || "";

    const mockResponseText = `Hi! I'm speaking on behalf of ${knowledgeData.meta.displayName}.
This is a placeholder response because the LLM provider integration is scheduled for the next step. 

However, I can confirm that:
1. Your request was successfully validated.
2. Your message was: "${lastUserMessage}"
3. The server successfully loaded the local knowledge files from the filesystem.
4. The generated system prompt contains ${systemPrompt.length} characters of developer context.
5. Your IP address detected from headers: ${clientIp}

Let me know if you would like me to proceed to the next implementation phase!`;

    return NextResponse.json({
      message: {
        role: "assistant",
        content: mockResponseText,
      },
      debug: {
        ip: clientIp,
        knowledgeLoaded: true,
        displayName: knowledgeData.meta.displayName,
      }
    });

  } catch (error: any) {
    console.error("Error in chat route handler:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
