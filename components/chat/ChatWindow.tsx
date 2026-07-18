"use client";

import { useEffect, useRef } from "react";
import type { Message } from "./ChatMessage";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import AssistantAvatar from "./AssistantAvatar";

interface ChatWindowProps {
  messages: Message[];
  isThinking: boolean;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
}

export default function ChatWindow({
  messages,
  isThinking,
  onSendMessage,
  onClearChat,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop =
      scrollRef.current.scrollHeight;
  }, [messages, isThinking]);

  return (
    <div className="w-full max-w-2xl h-132 rounded-3xl border flex flex-col relative overflow-hidden shadow-none bg-zinc-950 border-zinc-800/80">
      <div className="px-5 py-4 border-b border-zinc-850 flex items-center gap-4 bg-zinc-900/10">
        <AssistantAvatar showStatus />
        <h3 className="font-semibold text-zinc-50 leading-none">
          Portfolio AI Assistant
        </h3>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6 scroll-smooth scrollbar-minimal"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}

        {isThinking && (
          <div className="flex w-full items-end gap-3 px-1 animate-in fade-in duration-200">
            <AssistantAvatar />

            <div className="p-3.5 rounded-2xl rounded-tl-none bg-zinc-900 border border-zinc-800 flex items-center gap-1.5 min-w-15 justify-center h-10">
              <span className="w-2 h-2 rounded-full bg-zinc-600 animate-typing-dot-1" />
              <span className="w-2 h-2 rounded-full bg-zinc-600 animate-typing-dot-2" />
              <span className="w-2 h-2 rounded-full bg-zinc-600 animate-typing-dot-3" />
            </div>
          </div>
        )}
      </div>

      <div className="px-2 py-0.5 border-t border-zinc-800/80">
        <ChatInput
          onSendMessage={onSendMessage}
          onClearChat={onClearChat}
          isDisabled={isThinking}
        />
      </div>
    </div>
  );
}