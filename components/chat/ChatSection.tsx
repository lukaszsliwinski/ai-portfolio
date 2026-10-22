"use client";

import { useState, useRef } from "react";
import Link from "next/link";

import ChatWindow from "./ChatWindow";
import SuggestedQuestions from "./SuggestedQuestions";
import type { ChatUiMessage } from "@/chat/types";
import { readChatStream } from "@/chat/stream";

import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

import {
  CHAT_PRIVACY_NOTE,
  CHAT_TEXT,
  DEFAULT_WELCOME_MESSAGE,
} from "@/lib/constants";

interface ChatSectionProps {
  maxMessageLength: number;
  maxMessages: number;
}

const createMessage = (
  role: ChatUiMessage["role"],
  content: string,
): ChatUiMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
  content,
});

export default function ChatSection({
  maxMessageLength,
  maxMessages,
}: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatUiMessage[]>([
    DEFAULT_WELCOME_MESSAGE,
  ]);
  // isThinking covers the wait for the first chunk;
  // isSending locks the input until the reply is complete.
  const [isThinking, setIsThinking] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The ref blocks a double send immediately, before React re-renders.
  const isSendingRef = useRef(false);

  const handleSendMessage = async (content: string) => {
    const message = content.trim();
    if (!message || isSendingRef.current) return;
    isSendingRef.current = true;
    setIsSending(true);

    const userMessage = createMessage("user", message);
    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);
    setError(null);

    // The welcome message is UI only and never sent to the model.
    const history = [...messages, userMessage]
      .filter((m) => m.id !== "welcome-msg")
      .slice(-maxMessages)
      .map(({ role, content }) => ({ role, content }));

    let assistantMessageId: string | null = null;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      // Errors come back as JSON with an HTTP status, replies as a stream.
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

      const assistantMessage = createMessage("assistant", "");
      assistantMessageId = assistantMessage.id;
      setIsThinking(false);
      setMessages((prev) => [...prev, assistantMessage]);

      let receivedText = false;
      for await (const event of readChatStream(response.body)) {
        // Drop only the partial reply, keeping it out of the next history.
        if (event.type === "error") {
          setError(event.message || "The AI assistant encountered an error.");
          setMessages((prev) =>
            prev.filter((m) => m.id !== assistantMessage.id),
          );
          return;
        }

        if (!event.content) continue;
        receivedText = true;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: m.content + event.content }
              : m,
          ),
        );
      }

      if (!receivedText) {
        setError("Received an empty response from the server.");
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
      }
    } catch {
      setError(
        "Could not reach the assistant. Please check your connection and try again.",
      );
      if (assistantMessageId !== null) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
      }
    } finally {
      setIsThinking(false);
      setIsSending(false);
      isSendingRef.current = false;
    }
  };

  const handleClearChat = () => {
    if (isSendingRef.current) return;
    setMessages([DEFAULT_WELCOME_MESSAGE]);
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
            isSending={isSending}
            error={error}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            maxMessageLength={maxMessageLength}
          />
        </Reveal>
        <Reveal className="flex max-w-xl flex-1 flex-col gap-6">
          <SectionHeader main="Portfolio Assistant" />
          <p>{CHAT_TEXT}</p>
          <Reveal className="flex items-start gap-3 rounded-md border border-app-main/30 bg-app-main/10 px-4 py-3 text-xs text-app-foreground">
            <p className="text-left">
              {CHAT_PRIVACY_NOTE}{" "}
              <Link
                href="/privacy"
                className="font-semibold text-app-main underline underline-offset-2 hover:opacity-80"
              >Learn more</Link>
            </p>
          </Reveal>
          <SuggestedQuestions
            onSelectQuestion={handleSendMessage}
            isDisabled={isSending}
          />
        </Reveal>
      </div>
    </section>
  );
}
