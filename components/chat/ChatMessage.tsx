import React from "react";
import AssistantAvatar from "./AssistantAvatar";
import { cn } from "@/lib/utils";
// TODO: dokładniej przeanalizować
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

/**
 * Safely parses inline markdown elements (**bold**, `code`) into React elements
 * without using dangerouslySetInnerHTML.
 */
function parseInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      // TODO: czy <code> potrzebny jeśli chat powinien być zabezpieczony przed udzielaniem informacji innych niż w danych?
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-app-mid-dark font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
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
    <div className="flex flex-col gap-1.5 leading-relaxed">
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();

        // Bullet point list item
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={lineIndex} className="flex items-start gap-2 pl-1">
              <span className="text-app-text select-none">•</span>
              <span>{parseInlineFormatting(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Empty line -> vertical space
        if (trimmed === "") {
          return <div key={lineIndex} className="h-1" />;
        }

        // Standard text paragraph
        return <p key={lineIndex}>{parseInlineFormatting(line)}</p>;
      })}
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-end gap-3 px-1 animate-in fade-in slide-in-from-bottom-2 duration-200",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && <AssistantAvatar />}

      <div className={cn("flex flex-col max-w-3/4", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "p-3.5 text-sm leading-relaxed shadow-sm font-normal wrap-break-words",
            isUser
              ? "bg-app-main rounded-2xl rounded-tr-none"
              : "bg-app-mid-dark/40 border border-app-mid-dark rounded-2xl rounded-tl-none"
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
