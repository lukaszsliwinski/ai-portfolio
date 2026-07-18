"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";
import SuggestedQuestions from "./SuggestedQuestions";
import type { Message } from "./ChatMessage";
import {
  DEFAULT_WELCOME_MESSAGE,
  getMockAnswer,
} from "@/app/api/chat/mocks";

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
  id: `${role}-${Date.now()}`,
  role,
  content,
  timestamp: new Date(),
});

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>(
    createWelcomeMessages
  );
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = (content: string) => {
    const message = content.trim();

    if (!message || isThinking) return;

    setIsThinking(true);

    setMessages((prev) => [
      ...prev,
      createMessage("user", message),
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          getMockAnswer(message)
        ),
      ]);

      setIsThinking(false);
    }, 1200);
  };

  const handleClearChat = () => {
    setMessages(createWelcomeMessages());
    setIsThinking(false);
  };

  return (
    <section
      className="relative w-full py-24 flex flex-col items-center justify-center overflow-hidden"
      id="chat"
    >
      <div className="w-full max-w-6xl px-4 flex items-center justify-between gap-20">
        <div className="flex-1 flex flex-col items-center justify-center max-w-xl">
          <ChatWindow
            messages={messages}
            isThinking={isThinking}
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