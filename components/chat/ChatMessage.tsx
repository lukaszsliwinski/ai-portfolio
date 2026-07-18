import AssistantAvatar from "./AssistantAvatar";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
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
      {/* Assistant Avatar on left side */}
      {!isUser && (
        <AssistantAvatar />
      )}

      <div className={cn("flex flex-col max-w-3/4", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "p-3.5 text-sm leading-relaxed shadow-sm font-normal wrap-break-words",
            isUser
              ? "bg-main text-zinc-100 rounded-2xl rounded-tr-none"
              : "bg-zinc-900 text-zinc-100 border border-zinc-800/80 rounded-2xl rounded-tl-none"
          )}
        >
          {/* Output mockup text */}
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    </div>
  );
}
