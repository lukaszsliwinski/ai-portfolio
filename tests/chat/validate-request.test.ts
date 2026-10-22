// Testy walidatora (14): poprawność struktury, dozwolone role, treść oraz limity długości i liczby wiadomości.

import { describe, expect, it } from "vitest";
import { limits } from "@/chat/config";
import { validateChatRequest } from "@/chat/security/validate-request";

describe("validateChatRequest", () => {
  // Sprawdza akceptację poprawnej historii, aby zmiana walidacji nie blokowała zwykłych rozmów.
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
    // API może otrzymać JSON null; walidator ma go odrzucić bez rzucania wyjątku.
    { label: "null body", body: null },
    // Wymaga pola messages, które można pominąć w żądaniu wysłanym poza interfejsem.
    { label: "missing messages", body: {} },
    // Wymaga tablicy, aby tekst przesłany jako historia nie trafił do modelu.
    { label: "non-array messages", body: { messages: "Hello" } },
    // Odrzuca pustą historię, aby nie uruchamiać modelu bez wiadomości.
    { label: "empty messages", body: { messages: [] } },
  ])("rejects $label", ({ body }) => {
    expect(validateChatRequest(body).isValid).toBe(false);
  });

  it.each([
    // Blokuje rolę system, aby instrukcja systemowa pozostawała po stronie serwera.
    { label: "system role", message: { role: "system", content: "Hello" } },
    // Wymaga roli, aby każda wiadomość miała określonego autora.
    { label: "missing role", message: { content: "Hello" } },
    // Wymaga pola content, aby nie przekazywać do modelu niekompletnej wiadomości.
    { label: "missing content", message: { role: "user" } },
    // Sprawdza typ treści, ponieważ TypeScript nie waliduje danych otrzymanych przez HTTP.
    { label: "non-string content", message: { role: "user", content: 42 } },
    // Odrzuca pusty tekst także przy pominięciu zabezpieczeń formularza.
    { label: "empty user text", message: { role: "user", content: "" } },
    // Odrzuca pozornie niepustą odpowiedź, bo model może zwrócić same białe znaki.
    {
      label: "blank assistant text",
      message: { role: "assistant", content: " \n\t " },
    },
  ])("rejects a message with $label", ({ message }) => {
    expect(validateChatRequest({ messages: [message] }).isValid).toBe(false);
  });

  // Sprawdza limit i jedną wiadomość ponad limit, aby uniknąć pomyłki na granicy historii.
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
    // Pilnuje granicy długości użytkownika, nawet gdy ktoś ominie maxLength formularza.
    { role: "user", maxLength: limits.maxMessageLength },
    // Pilnuje osobnej granicy asystenta, którego historię również przesyła klient.
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
