// Shared by the API route and the client UI.

export const CHAT_ROLES = ["user", "assistant"] as const;
export type ChatRole = (typeof CHAT_ROLES)[number];

export interface ChatRequestMessage {
  role: ChatRole;
  content: string;
}

export interface ChatUiMessage extends ChatRequestMessage {
  id: string;
}

export type ChatStreamEvent =
  { type: "text"; content: string } | { type: "error"; message: string };
