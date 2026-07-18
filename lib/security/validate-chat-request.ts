export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const MAX_MESSAGE_LENGTH = 800;
const MAX_CONVERSATION_LENGTH = 10;
const ALLOWED_ROLES = ["user", "assistant"];

/**
 * Validates the structure and content limits of an incoming chat request.
 */
export function validateChatRequest(body: any): ValidationResult {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Invalid request payload." };
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages)) {
    return { isValid: false, error: "Missing or invalid 'messages' field. It must be an array." };
  }

  if (messages.length === 0) {
    return { isValid: false, error: "The 'messages' array cannot be empty." };
  }

  if (messages.length > MAX_CONVERSATION_LENGTH) {
    return {
      isValid: false,
      error: `Conversation history is too long. Maximum allowed messages is ${MAX_CONVERSATION_LENGTH}.`,
    };
  }

  // Validate each message structure
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || typeof msg !== "object") {
      return { isValid: false, error: `Message at index ${i} is not a valid object.` };
    }

    const { role, content } = msg;

    if (!role || typeof role !== "string" || !ALLOWED_ROLES.includes(role)) {
      return {
        isValid: false,
        error: `Message at index ${i} has an invalid role. Allowed roles are: ${ALLOWED_ROLES.join(", ")}.`,
      };
    }

    if (typeof content !== "string") {
      return { isValid: false, error: `Message content at index ${i} must be a string.` };
    }

    const trimmedContent = content.trim();
    if (trimmedContent === "") {
      return { isValid: false, error: `Message content at index ${i} cannot be empty.` };
    }

    // Check message length limit only for the user's latest input
    if (role === "user" && content.length > MAX_MESSAGE_LENGTH) {
      return {
        isValid: false,
        error: `Message is too long. Maximum allowed length is ${MAX_MESSAGE_LENGTH} characters.`,
      };
    }
  }

  return { isValid: true };
}
