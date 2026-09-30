"use client";

import { useState, useRef } from "react";

import ChatWindow from "./ChatWindow";
import SuggestedQuestions from "./SuggestedQuestions";
import type { Message } from "./ChatMessage";

import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

import { DEFAULT_WELCOME_MESSAGE } from "@/app/api/chat/mocks";
import { STREAM_ERROR_PREFIX } from "@/lib/ai/provider";
import { CHAT_TEXT } from "@/lib/constants";

// Must match MAX_CONVERSATION_LENGTH in validate-chat-request.ts
const MAX_API_MESSAGES = 10;

const createWelcomeMessages = (): Message[] => [
  { ...DEFAULT_WELCOME_MESSAGE, timestamp: new Date() },
];

const createMessage = (role: Message["role"], content: string): Message => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
  content,
  timestamp: new Date(),
});

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>(createWelcomeMessages);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSendingRef = useRef(false);

  const handleSendMessage = async (content: string) => {
    const message = content.trim();
    if (!message || isThinking || isSendingRef.current) return;
    isSendingRef.current = true;

    // Optimistically add the user message and clear previous error
    const userMessage = createMessage("user", message);
    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);
    setError(null);

    // Build history: exclude welcome message, cap at API limit
    const history = [...messages, userMessage]
      .filter((m) => m.id !== "welcome-msg")
      .slice(-MAX_API_MESSAGES)
      .map(({ role, content }) => ({ role, content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      // Non-2xx responses are JSON errors (validation, 503, etc.)
      if (!response.ok) {
        const data = await response.json();
        setError(
          data?.error ?? `Request failed with status ${response.status}.`,
        );
        return;
      }

      if (!response.body) {
        setError("Received an empty response from the server.");
        return;
      }

      // Add an empty assistant message and stream content into it
      const assistantMessage = createMessage("assistant", "");
      setIsThinking(false);
      setMessages((prev) => [...prev, assistantMessage]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        if (chunk.includes(STREAM_ERROR_PREFIX)) {
          const apiError =
            chunk.split(STREAM_ERROR_PREFIX)[1] ||
            "The AI assistant encountered an error.";
          setError(apiError);
          setMessages((prev) =>
            prev.filter((m) => m.id !== assistantMessage.id),
          );
          break;
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: m.content + chunk }
              : m,
          ),
        );
      }
    } catch {
      setError(
        "Could not reach the assistant. Please check your connection and try again.",
      );
    } finally {
      setIsThinking(false);
      isSendingRef.current = false;
    }
  };

  const handleClearChat = () => {
    setMessages(createWelcomeMessages());
    setIsThinking(false);
    isSendingRef.current = false;
    setError(null);
  };

  return (
    <section
      className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden py-24"
      id="chat"
    >
      <div className="flex max-w-4xl items-center justify-between gap-12 max-lg:flex-col-reverse lg:gap-20 xl:max-w-6xl">
        <Reveal className="flex max-w-xl flex-1 flex-col items-center justify-center">
          <ChatWindow
            messages={messages}
            isThinking={isThinking}
            error={error}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
          />
        </Reveal>
        <Reveal className="flex max-w-xl flex-1 flex-col gap-6">
          <SectionHeader main="Portfolio Assistant" />
          <p>{CHAT_TEXT}</p>
          <SuggestedQuestions onSelectQuestion={handleSendMessage} />
        </Reveal>
      </div>
    </section>
  );
}
