// Odczytuje i waliduje wymagane zmienne środowiskowe konfigurujące Gemini oraz limity chatu.
type ChatEnvName =
  | "CHAT_RATE_LIMIT_REQUESTS"
  | "CHAT_RATE_LIMIT_WINDOW_HOURS"
  | "CHAT_MAX_MESSAGE_LENGTH"
  | "CHAT_MAX_MESSAGES"
  | "GEMINI_API_KEY"
  | "LLM_MODEL";  // TODO: to do usunięcia

function readRequiredString(name: ChatEnvName): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readPositiveNumber(name: ChatEnvName, integer = true): number {
  const rawValue = readRequiredString(name);

  const value = Number(rawValue);
  const isValid =
    Number.isFinite(value) &&
    value > 0 &&
    (!integer || Number.isInteger(value));

  if (!isValid) {
    throw new Error(
      `${name} must be a positive ${integer ? "integer" : "number"}.`,
    );
  }

  return value;
}

export const chatConfig = {
  geminiApiKey: readRequiredString("GEMINI_API_KEY"),
  model: readRequiredString("LLM_MODEL"),
  rateLimitRequests: readPositiveNumber("CHAT_RATE_LIMIT_REQUESTS"),
  rateLimitWindowHours: readPositiveNumber(
    "CHAT_RATE_LIMIT_WINDOW_HOURS",
    false,
  ),
  maxMessageLength: readPositiveNumber("CHAT_MAX_MESSAGE_LENGTH"),
  maxMessages: readPositiveNumber("CHAT_MAX_MESSAGES"),
} as const;
