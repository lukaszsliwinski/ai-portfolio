// Pobiera i exportuje zmienne środowiskowe
function env(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing env variable: ${name}`);
  return value;
}

export const chatConfig = {
  geminiApiKey: env("GEMINI_API_KEY"),
  model: env("LLM_MODEL"),
  rateLimitRequests: Number(env("CHAT_RATE_LIMIT_REQUESTS")),
  rateLimitWindowHours: Number(env("CHAT_RATE_LIMIT_WINDOW_HOURS")),
  maxMessageLength: Number(env("CHAT_MAX_MESSAGE_LENGTH")),
  maxMessages: Number(env("CHAT_MAX_MESSAGES")),
} as const;
