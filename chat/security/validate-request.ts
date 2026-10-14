// Waliduje strukturę, role, zawartość i limity historii wiadomości przesyłanej do endpointu chatu.
import { chatConfig } from "@/chat/config";
import { CHAT_ROLES } from "@/chat/types";
import type { ChatRequestMessage } from "@/chat/types";

type ValidationResult =
  | { isValid: true; data: { messages: ChatRequestMessage[] } }
  | { isValid: false; error: string };

const fail = (error: string): ValidationResult => ({ isValid: false, error });

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isChatMessage(value: unknown): value is ChatRequestMessage {
  return (
    isRecord(value) &&
    CHAT_ROLES.some((role) => role === value.role) &&
    typeof value.content === "string" &&
    value.content.trim() !== ""
  );
}

export function validateChatRequest(body: unknown): ValidationResult {
  const messages = isRecord(body) ? body.messages : undefined;

  if (!Array.isArray(messages) || messages.length === 0) {
    return fail("'messages' must be a non-empty array.");
  }

  if (messages.length > chatConfig.maxMessages) {
    return fail(`Conversation history is too long. Maximum allowed messages is ${chatConfig.maxMessages}.`);
  }

  if (!messages.every(isChatMessage)) {
    return fail(`Each message needs a role (${CHAT_ROLES.join(", ")}) and non-empty text content.`);
  }

  if (messages.some((m) => m.role === "user" && m.content.length > chatConfig.maxMessageLength)) {
    return fail(`Message is too long. Maximum allowed length is ${chatConfig.maxMessageLength} characters.`);
  }
  
  // Rebuild objects so any extra client-sent fields are dropped.
  return {
    isValid: true,
    data: { messages: messages.map(({ role, content }) => ({ role, content })) },
  };
}