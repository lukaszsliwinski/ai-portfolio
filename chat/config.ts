// Przechowuje limity chatu i odczytuje konfigurację modelu dopiero przy wywołaniu.
function env(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing env variable: ${name}`);
  return value;
}

export const limits = {
  rateLimitRequests: 10,
  rateLimitWindowHours: 1,
  maxMessageLength: 800,
  maxAssistantMessageLength: 5000,
  maxAssistantOutputTokens: 800,
  maxMessages: 10,
} as const;

export function getModelConfig() {
  return {
    apiKey: env("GEMINI_API_KEY"),
    model: env("LLM_MODEL"),
  };
}
