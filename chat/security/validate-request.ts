// The client sends the whole history, so every message is validated.
import { limits } from "@/chat/config";
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

  if (messages.length > limits.maxMessages) {
    return fail(
      `Conversation history is too long. Maximum allowed messages is ${limits.maxMessages}.`,
    );
  }

  if (!messages.every(isChatMessage)) {
    return fail(
      `Each message needs a role (${CHAT_ROLES.join(", ")}) and non-empty text content.`,
    );
  }

  // Assistant messages also come from the client and get their own limit.
  for (const message of messages) {
    const maxLength =
      message.role === "assistant"
        ? limits.maxAssistantMessageLength
        : limits.maxMessageLength;

    if (message.content.length > maxLength) {
      return fail(
        `Message is too long. Maximum allowed length is ${maxLength} characters.`,
      );
    }
  }

  // Only role and content are passed on; extra fields from the client are dropped.
  return {
    isValid: true,
    data: {
      messages: messages.map(({ role, content }) => ({ role, content })),
    },
  };
}
