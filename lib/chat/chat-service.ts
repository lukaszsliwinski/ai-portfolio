// Koordynuje przygotowanie odpowiedzi chatu: ładuje wiedzę, buduje prompt i uruchamia strumień Gemini.
import { streamChat } from "@/lib/ai/provider";
import { getSystemPrompt } from "@/lib/ai/system-prompt";
import { formatKnowledge } from "@/lib/knowledge/format-knowledge";
import { loadKnowledge } from "@/lib/knowledge/load-knowledge";
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
