import { describe, expect, it } from "vitest";
import { limits } from "@/chat/config";
import { validateChatRequest } from "@/chat/security/validate-request";

describe("validateChatRequest", () => {
  it("accepts a conversation containing user and assistant messages", () => {
    const messages = [
      { role: "user", content: "What is your main stack?" },
      { role: "assistant", content: "I work with React and TypeScript." },
    ];

    expect(validateChatRequest({ messages })).toEqual({
      isValid: true,
      data: { messages },
    });
  });

  it.each([
    // null is valid JSON, so it has to be rejected without throwing.
    { label: "null body", body: null },
    { label: "missing messages", body: {} },
    { label: "non-array messages", body: { messages: "Hello" } },
    { label: "empty messages", body: { messages: [] } },
  ])("rejects $label", ({ body }) => {
    expect(validateChatRequest(body).isValid).toBe(false);
  });

  it.each([
    // The system prompt must stay on the server.
    { label: "system role", message: { role: "system", content: "Hello" } },
    { label: "missing role", message: { content: "Hello" } },
    { label: "missing content", message: { role: "user" } },
    // TypeScript types don't validate data that arrives over HTTP.
    { label: "non-string content", message: { role: "user", content: 42 } },
    // Requests can bypass the form, so empty text is checked on the server too.
    { label: "empty user text", message: { role: "user", content: "" } },
    // Whitespace-only text counts as empty.
    {
      label: "blank assistant text",
      message: { role: "assistant", content: " \n\t " },
    },
  ])("rejects a message with $label", ({ message }) => {
    expect(validateChatRequest({ messages: [message] }).isValid).toBe(false);
  });

  it("accepts the maximum history length and rejects one extra message", () => {
    const messages = Array.from({ length: limits.maxMessages }, () => ({
      role: "user",
      content: "Hello",
    }));

    expect(validateChatRequest({ messages }).isValid).toBe(true);
    expect(
      validateChatRequest({ messages: [...messages, messages[0]] }).isValid,
    ).toBe(false);
  });

  it.each([
    // The form's maxLength is easy to bypass, so the server enforces it too.
    { role: "user", maxLength: limits.maxMessageLength },
    // Assistant history also comes from the client.
    { role: "assistant", maxLength: limits.maxAssistantMessageLength },
  ])(
    "enforces the $role character limit at its boundary",
    ({ role, maxLength }) => {
      const content = "a".repeat(maxLength);

      expect(
        validateChatRequest({ messages: [{ role, content }] }).isValid,
      ).toBe(true);
      expect(
        validateChatRequest({ messages: [{ role, content: content + "a" }] })
          .isValid,
      ).toBe(false);
    },
  );
});
