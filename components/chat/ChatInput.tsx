"use client";

import { useEffect, useRef, useState } from "react";
import { faArrowUp, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import FaWrapper from "@/components/ui/FaWrapper";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  isDisabled?: boolean;
  maxMessageLength: number;
}

export function ChatInput({
  onSendMessage,
  onClearChat,
  isDisabled = false,
  maxMessageLength,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const message = value.trim();

    if (!message || isDisabled) return;

    setValue("");
    onSendMessage(message);
  };

  // Reset first, so the field can also shrink when text is deleted.
  useEffect(() => {
    if (!inputRef.current) return;

    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 84)}px`;
  }, [value]);

  // Refocus after the reply; preventScroll stops the page from jumping to the input.
  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus({
        preventScroll: true,
      });
    }
  }, [isDisabled]);

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
        disabled={isDisabled}
        title="Clear Conversation"
        aria-label="Clear conversation history"
        className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-app-mid-dark bg-app-mid-dark/20 text-app-text transition-all hover:bg-app-mid-dark/30 hover:text-app-foreground focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-main active:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FaWrapper icon={faRotateLeft} size={16} />
      </button>

      <div className="relative flex-1 pt-1.5">
        <textarea
          ref={inputRef}
          value={value}
          rows={1}
          disabled={isDisabled}
          maxLength={maxMessageLength}
          aria-label="Ask a question"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter adds a new line.
            // e.repeat stops a held key from sending repeatedly.
            if (e.key === "Enter" && !e.shiftKey && !e.repeat) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={
            isDisabled ? "Assistant is responding..." : "Write a question..."
          }
          className="scrollbar-minimal max-h-21 min-h-11.5 w-full resize-none overflow-y-auto rounded-md border border-app-mid-dark bg-app-mid-dark/40 p-3 placeholder-app-text focus:ring-1 focus:ring-app-mid-light focus:outline-none disabled:cursor-not-allowed"
        />

        <span className="absolute right-3 bottom-2 bg-app-mid-dark/10 px-1.5 py-0.5 text-[10px] text-app-text">
          {count}/{maxMessageLength}
        </span>
      </div>

      <button
        type="submit"
        disabled={isDisabled || !value.trim()}
        aria-label="Send message"
        className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-app-foreground/90 text-app-background transition-all hover:opacity-80 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FaWrapper icon={faArrowUp} size={16} />
      </button>
    </form>
  );
}
