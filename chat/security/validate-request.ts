// Waliduje strukturę, role, zawartość i limity historii wiadomości przesyłanej do endpointu chatu.
import { chatConfig } from "@/chat/config";
import { CHAT_ROLES } from "@/chat/types";
import type {
  ChatRequest,
  ChatRequestMessage,
  ChatRole,
} from "@/chat/types";

type ValidationResult =
  { isValid: true; data: ChatRequest } | { isValid: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isChatRole(value: unknown): value is ChatRole {
  return typeof value === "string" && CHAT_ROLES.some((role) => role === value);
}

/**
 * Validates the structure and content limits of an incoming chat request.
 */
export function validateChatRequest(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return { isValid: false, error: "Invalid request payload." };
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages)) {
    return {
      isValid: false,
      error: "Missing or invalid 'messages' field. It must be an array.",
    };
  }

  if (messages.length === 0) {
    return { isValid: false, error: "The 'messages' array cannot be empty." };
  }

  if (messages.length > chatConfig.maxMessages) {
    return {
      isValid: false,
      error: `Conversation history is too long. Maximum allowed messages is ${chatConfig.maxMessages}.`,
    };
  }

  const validatedMessages: ChatRequestMessage[] = [];

  // Validate each message structure
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!isRecord(msg)) {
      return {
        isValid: false,
        error: `Message at index ${i} is not a valid object.`,
      };
    }

    const { role, content } = msg;

    if (!isChatRole(role)) {
      return {
        isValid: false,
        error: `Message at index ${i} has an invalid role. Allowed roles are: ${CHAT_ROLES.join(", ")}.`,
      };
    }

    if (typeof content !== "string") {
      return {
        isValid: false,
        error: `Message content at index ${i} must be a string.`,
      };
    }

    const trimmedContent = content.trim();
    if (trimmedContent === "") {
      return {
        isValid: false,
        error: `Message content at index ${i} cannot be empty.`,
      };
    }

    // Check the length of every user message in the submitted history.
    if (role === "user" && content.length > chatConfig.maxMessageLength) {
      return {
        isValid: false,
        error: `Message is too long. Maximum allowed length is ${chatConfig.maxMessageLength} characters.`,
      };
    }

    validatedMessages.push({ role, content });
  }

  return { isValid: true, data: { messages: validatedMessages } };
}
