// used in chat/security/validate-request.ts and components/chat/types.ts
export const CHAT_ROLES = ["user", "assistant"] as const;
export type ChatRole = (typeof CHAT_ROLES)[number];

// used in chat/security/validate-request.ts and chat/service.ts
export interface ChatRequestMessage {
  role: ChatRole;
  content: string;
}

// used in chat/model/provider.ts and chat/service.ts
export interface LLMMessage {
  role: ChatRole | "system";
  content: string;
}
