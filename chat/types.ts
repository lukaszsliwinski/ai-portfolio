// Roles shared by API requests and UI messages.
export const CHAT_ROLES = ["user", "assistant"] as const;
export type ChatRole = (typeof CHAT_ROLES)[number];

// Conversation messages shared by request validation, service, provider and UI.
export interface ChatRequestMessage {
  role: ChatRole;
  content: string;
}

export interface ChatUiMessage extends ChatRequestMessage {
  id: string;
}

// Events sent as JSON Lines by the provider and read by the chat client.
export type ChatStreamEvent =
  { type: "text"; content: string } | { type: "error"; message: string };
