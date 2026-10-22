import { streamChat } from "@/chat/model/provider";
import { getSystemPrompt } from "@/chat/model/system-prompt";
import { getKnowledge } from "@/chat/knowledge";
import type { ChatRequestMessage } from "./types";

export async function createChatStream(
  messages: ChatRequestMessage[],
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = getSystemPrompt(await getKnowledge());
  return streamChat(messages, systemPrompt);
}
