"use client";

import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";

const chatParsers = {
  chat_open: parseAsBoolean.withDefault(false),
  chat_initial_message: parseAsString.withDefault(""),
};

export function useChatParams() {
  const [params, setParams] = useQueryStates(chatParsers);

  const openChat = (initialMessage?: string) => {
    setParams({
      chat_open: true,
      chat_initial_message: initialMessage ?? null,
    });
  };

  const closeChat = () => {
    setParams({
      chat_open: null,
      chat_initial_message: null,
    });
  };

  const clearInitialMessage = () => {
    setParams({ chat_initial_message: null });
  };

  return {
    chatOpen: params.chat_open,
    chatInitialMessage: params.chat_initial_message,
    openChat,
    closeChat,
    clearInitialMessage,
  };
}
