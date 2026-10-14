// Renderuje wiadomość użytkownika lub asystenta, bezpiecznie obsługując podstawowe formatowanie Markdown.
import React from "react";
import AssistantAvatar from "./AssistantAvatar";
import type { ChatUiMessage } from "./types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatUiMessage;
}

/**
 * Safely parses **bold** into React elements without using dangerouslySetInnerHTML.
 */
function parseBoldFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
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

/**
 * Safely renders markdown content (bullet lists, paragraphs, inline formatting).
 */
function FormattedContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="flex flex-col gap-1.5">
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();

        // Bullet point list item
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={lineIndex} className="flex items-start gap-2 pl-1">
              <span className="text-app-text select-none">•</span>
              <span>{parseBoldFormatting(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Empty line -> vertical space
        if (trimmed === "") {
          return <div key={lineIndex} className="h-1" />;
        }

        // Standard text paragraph
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
        "animate-in fade-in slide-in-from-bottom-2 flex w-full items-end gap-3 px-1 duration-200",
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
