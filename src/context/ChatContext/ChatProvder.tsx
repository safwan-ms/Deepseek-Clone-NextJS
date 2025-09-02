"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react";
import axios from "axios";
import { ChatContext } from "./ChatContext";
import toast from "react-hot-toast";

type ChatMessage = {
  role: string;
  content: string;
  timestamp: number;
};

export type Chat = {
  _id: string;
  name: string;
  messages: ChatMessage[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const createNewChat = async () => {
    try {
      if (!user) return;
      const token = await getToken();
      const { data } = await axios.post(
        "/api/chat/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChats((prev) => [...prev, data.chat]);
      setSelectedChat(data.chat);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown Error");
      console.error("Error creating new chat:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{ user, chats, selectedChat, setSelectedChat, createNewChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};
