// Koordynuje przygotowanie odpowiedzi chatu: ładuje wiedzę, buduje prompt i uruchamia strumień Gemini.
import { streamChat } from "@/chat/model/gemini";
import { getSystemPrompt } from "@/chat/model/system-prompt";
import { formatKnowledge } from "@/chat/knowledge/format-knowledge";
import { loadKnowledge } from "@/chat/knowledge/load-knowledge";
import type { ChatRequestMessage, LLMMessage } from "./types";

/** Builds the knowledge-grounded prompt and starts a streamed Gemini response. */
export async function createChatStream(
  messages: ChatRequestMessage[],
): Promise<ReadableStream<Uint8Array>> {
  const knowledge = await loadKnowledge();
  const systemPrompt = getSystemPrompt(formatKnowledge(knowledge));
  const llmMessages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  return streamChat(llmMessages);
}
