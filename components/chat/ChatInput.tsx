"use client";

import { useEffect, useRef, useState } from "react";
import { faArrowUp, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import FaWrapper from "@/components/ui/FaWrapper";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  isDisabled?: boolean;
}

// TODO: wszystko ujednolicić z .env (ma być jedno miejsce na tego typu dane) - jeśli nie ma przeciwskazań to może w constants.ts
// Must match MAX_MESSAGE_LENGTH in lib/security/validate-chat-request.ts
const MAX_QUESTION_LENGTH = 800;

export function ChatInput({
  onSendMessage,
  onClearChat,
  isDisabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handle message submission
  const submit = () => {
    const message = value.trim();

    if (!message || isDisabled) return;

    setValue("");
    onSendMessage(message);
  };

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (!inputRef.current) return;

    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 84)}px`;
  }, [value]);

  // Auto-focus the textarea when not disabled
  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus({
        preventScroll: true,
      });
    }
  }, [isDisabled]);

  // Count the number of characters in the input
  const count = value.length;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
        className="flex items-center gap-2"
    >
      <button
        type="button"
        onClick={onClearChat}
        title="Clear Conversation"
        aria-label="Clear conversation history"
        className="w-10 h-10 rounded-full flex justify-center items-center border shrink-0 transition-all
          text-app-text hover:text-app-foreground bg-app-mid-dark/20 hover:bg-app-mid-dark/30 border-app-mid-dark
          active:opacity-90 focus:outline-none cursor-pointer"
      >
        <FaWrapper icon={faRotateLeft} size={16} />
      </button>

      <div className="relative flex-1 pt-1.5">
        <textarea
          ref={inputRef}
          value={value}
          rows={1}
          disabled={isDisabled}
          maxLength={MAX_QUESTION_LENGTH}
          aria-label="Ask a question"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.repeat) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={
            isDisabled
              ? "Assistant is thinking..."
              : "Write a question..."
          }
          className="w-full max-h-21 min-h-11.5 overflow-y-auto resize-none scrollbar-minimal p-3 rounded-xl border text-sm font-medium
          bg-app-mid-dark/40 border-app-mid-dark
          placeholder-app-text focus:ring-1 focus:ring-app-mid-light focus:outline-none
          disabled:cursor-not-allowed"
        />

        <span className="absolute right-3 bottom-2 text-[10px] font-semibold text-app-text bg-app-mid-dark/10 px-1.5 py-0.5 rounded-lg">
          {count}/{MAX_QUESTION_LENGTH}
        </span>
      </div>

      <button
        type="submit"
        disabled={isDisabled || !value.trim()}
        aria-label="Send message"
        className="w-10 h-10 rounded-full flex justify-center items-center shrink-0 transition-all
          bg-app-foreground/90 text-app-background hover:opacity-80
          active:opacity-90 cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FaWrapper icon={faArrowUp} size={16} />
      </button>
    </form>
  );
}