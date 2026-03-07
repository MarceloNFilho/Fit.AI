"use client";

import { Sparkles } from "lucide-react";
import { useChatParams } from "./use-chat-params";

export function ChatTrigger() {
  const { openChat } = useChatParams();

  return (
    <button
      onClick={() => openChat()}
      className="flex items-center justify-center rounded-full bg-primary p-4"
    >
      <Sparkles className="size-6 text-primary-foreground" />
    </button>
  );
}
