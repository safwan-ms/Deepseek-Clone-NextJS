"use client";

import { createContext, useContext } from "react";
import type { UserResource } from "@clerk/types";
import type { Chat } from "./ChatProvder";

export type ChatContextType = {
  user: UserResource | null | undefined;
  chats: Chat[];
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  sendMessage: (prompt: string) => Promise<void>;
  isLoading: boolean;
  createNewChat: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, newName: string) => Promise<void>;
};

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined,
);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
