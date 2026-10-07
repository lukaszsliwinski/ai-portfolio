"use client";

// Buduje okno rozmowy z historią wiadomości, automatycznym przewijaniem, stanami ładowania i formularzem.
import { useEffect, useRef } from "react";
import type { ChatUiMessage } from "./types";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import AssistantAvatar from "./AssistantAvatar";

interface ChatWindowProps {
  messages: ChatUiMessage[];
  isThinking: boolean;
  /** Non-null when the last API call returned an error. */
  error: string | null;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  maxMessageLength: number;
}

export default function ChatWindow({
  messages,
  isThinking,
  error,
  onSendMessage,
  onClearChat,
  maxMessageLength,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking, error]);

  return (
    <div
      className="relative flex h-132 w-full max-w-2xl scroll-mt-24 flex-col overflow-hidden rounded-lg border border-app-mid-dark bg-app-background/70 text-sm text-app-foreground shadow-none"
      id="chat-window"
    >
      <div className="flex items-center gap-3 border-b border-app-mid-dark p-4">
        <AssistantAvatar showStatus />
        <h3 className="font-semibold">Portfolio Assistant</h3>
      </div>

      {/* TODO: dobrze przeanalizować zachowanie klasy [overflow-anchor:none] */}
      <div
        ref={scrollRef}
        aria-live="polite"
        className="scrollbar-minimal flex flex-1 flex-col gap-6 overflow-y-auto scroll-smooth p-5 [overflow-anchor:none]"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Loading indicator */}
        {isThinking && (
          <div className="animate-in fade-in flex w-full items-end gap-3 px-1 duration-200">
            <AssistantAvatar />

            <div className="flex h-10 min-w-15 items-center justify-center gap-1.5 rounded-lg rounded-tl-none border border-app-mid-dark bg-app-mid-dark/40 p-3.5">
              <span className="size-2 animate-typing-dot-1 rounded-full bg-app-text" />
              <span className="size-2 animate-typing-dot-2 rounded-full bg-app-text" />
              <span className="size-2 animate-typing-dot-3 rounded-full bg-app-text" />
            </div>
          </div>
        )}

        {/* Error state */}
        {!isThinking && error && (
          <div
            role="alert"
            className="animate-in fade-in flex w-full items-start gap-3 px-1 duration-200"
          >
            <div className="flex-1 rounded-md border border-red-800/50 bg-red-950/60 px-4 py-3 text-red-300">
              {error}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-app-mid-dark px-2 py-0.5">
        <ChatInput
          onSendMessage={onSendMessage}
          onClearChat={onClearChat}
          isDisabled={isThinking}
          maxMessageLength={maxMessageLength}
        />
      </div>
    </div>
  );
}
