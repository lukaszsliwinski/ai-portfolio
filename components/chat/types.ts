// Definiuje typ wiadomości przechowywanej i wyświetlanej po stronie interfejsu chatu.
import type { ChatRole } from "@/chat/types";

export interface ChatUiMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
}
