export const CHAT_ROLES = ["user", "assistant"] as const;

export type ChatRole = (typeof CHAT_ROLES)[number];

export interface ChatRequestMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatRequestMessage[];
}

export interface LLMMessage {
  role: ChatRole | "system";
  content: string;
}
