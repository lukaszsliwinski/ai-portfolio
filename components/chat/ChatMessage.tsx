import React from "react";
import AssistantAvatar from "./AssistantAvatar";
import type { ChatUiMessage } from "@/chat/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatUiMessage;
}

// Builds React elements instead of injecting the model's output as HTML,
// so there is nothing to sanitize.
function parseBoldFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Supports only what the system prompt allows: paragraphs, bold and "-" lists.
function FormattedContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="flex flex-col gap-1.5">
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={lineIndex} className="flex items-start gap-2 pl-1">
              <span className="text-app-text select-none">•</span>
              <span>{parseBoldFormatting(trimmed.slice(2))}</span>
            </div>
          );
        }

        if (trimmed === "") {
          return <div key={lineIndex} className="h-1" />;
        }

        return <p key={lineIndex}>{parseBoldFormatting(line)}</p>;
      })}
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-end gap-3 px-1",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && <AssistantAvatar />}

      <div
        className={cn(
          "flex max-w-3/4 flex-col",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "wrap-break-words p-3.5 shadow-sm",
            isUser
              ? "rounded-lg rounded-tr-none bg-app-main"
              : "rounded-lg rounded-tl-none border border-app-mid-dark bg-app-mid-dark/40",
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <FormattedContent content={message.content} />
          )}
        </div>
      </div>
    </div>
  );
}
