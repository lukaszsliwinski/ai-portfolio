"use client";

import { useState, useRef } from "react";
import ChatWindow from "./ChatWindow";
import SuggestedQuestions from "./SuggestedQuestions";
import type { Message } from "./ChatMessage";
import { DEFAULT_WELCOME_MESSAGE } from "@/app/api/chat/mocks";
import { STREAM_ERROR_PREFIX } from "@/lib/ai/provider";

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
        setError(data?.error ?? `Request failed with status ${response.status}.`);
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
          const apiError = chunk.split(STREAM_ERROR_PREFIX)[1] || "The AI assistant encountered an error.";
          setError(apiError);
          setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
          break;
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: m.content + chunk }
              : m
          )
        );
      }
    } catch {
      setError("Could not reach the assistant. Please check your connection and try again.");
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
      className="relative w-full min-h-screen py-24 flex flex-col items-center justify-center overflow-hidden"
      id="chat"
    >
      <div className="w-full max-w-6xl px-4 flex items-center justify-between gap-20">
        <div className="flex-1 flex flex-col items-center justify-center max-w-xl">
          <ChatWindow
            messages={messages}
            isThinking={isThinking}
            error={error}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
          />
        </div>

        <div className="flex-1 flex flex-col items-start justify-center max-w-xl gap-6 w-full">
          <h1 className="text-4xl font-extrabold text-zinc-50 leading-tight">
            Lorem Ipsum<br />
            <small className="tracking-widest">consectetur <span className="text-main">adipisci</span></small>
          </h1>

          <p className="text-zinc-400 font-normal leading-relaxed text-justify mb-4">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.
          </p>

          <SuggestedQuestions
            onSelectQuestion={handleSendMessage}
            isDisabled={isThinking}
          />
        </div>
      </div>
    </section>
  );
}