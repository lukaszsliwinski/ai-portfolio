"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";
import SuggestedQuestions from "./SuggestedQuestions";
import type { Message } from "./ChatMessage";
import { DEFAULT_WELCOME_MESSAGE } from "@/app/api/chat/mocks";

// Maximum messages sent to the API (must match validate-chat-request.ts)
const MAX_API_MESSAGES = 10;

const createWelcomeMessages = (): Message[] => [
  {
    ...DEFAULT_WELCOME_MESSAGE,
    timestamp: new Date(),
  },
];

const createMessage = (
  role: Message["role"],
  content: string
): Message => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
  content,
  timestamp: new Date(),
});

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>(
    createWelcomeMessages
  );
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (content: string) => {
    const message = content.trim();
    if (!message || isThinking) return;

    // Optimistically add the user message and clear any previous error
    const userMessage = createMessage("user", message);
    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);
    setError(null);

    // Build the conversation history to send to the API.
    // Skip the initial welcome message (role: assistant, id: "welcome-msg")
    // and cap at MAX_API_MESSAGES entries.
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

      const data = await response.json();

      if (!response.ok) {
        // Server returned a structured error (validation, 503, etc.)
        const errorMessage =
          data?.error ?? `Request failed with status ${response.status}.`;
        setError(errorMessage);
      } else {
        const assistantContent: string =
          data?.message?.content ?? "I received your message but couldn't form a response.";

        setMessages((prev) => [
          ...prev,
          createMessage("assistant", assistantContent),
        ]);
      }
    } catch {
      // Network error or JSON parse failure
      setError("Could not reach the assistant. Please check your connection and try again.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    setMessages(createWelcomeMessages());
    setIsThinking(false);
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

          <SuggestedQuestions onSelectQuestion={handleSendMessage} />
        </div>
      </div>
    </section>
  );
}