"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!user) return;
        const token = await getToken();
        const { data } = await axios.get("/api/chat/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data.success) {
          setChats(data.data);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        toast.error("Failed to load history");
      }
    };

    fetchChats();
  }, [user, getToken]);

  const createChatInternal = async (): Promise<Chat | null> => {
    try {
      if (!user) return null;
      const token = await getToken();
      const { data } = await axios.post(
        "/api/chat/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data.data; // API returns { success: true, data: newChat }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown Error");
      console.error("Error creating new chat:", error);
      return null;
    }
  };

  const sendMessage = async (prompt: string) => {
    if (!user) return;

    let currentChat = selectedChat;

    // Auto-create chat if none selected
    if (!currentChat) {
      setIsLoading(true); // Start loading earlier
      const newChat = await createChatInternal();
      if (newChat) {
        setChats((prev) => [...prev, newChat]);
        setSelectedChat(newChat);
        currentChat = newChat;
      } else {
        setIsLoading(false);
        return;
      }
    }

    // Check again to satisfy TS
    if (!currentChat) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    // Optimistically update the UI with user message
    const updatedChat: Chat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
    };
    setSelectedChat(updatedChat);
    setChats((prev) =>
      prev.map((chat) => (chat._id === currentChat!._id ? updatedChat : chat)),
    );

    try {
      const token = await getToken();
      console.log("🚀 Sending request to backend...");
      const { data } = await axios.post(
        "/api/chat/ai",
        {
          chatId: currentChat._id,
          prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        const aiMessage: ChatMessage = data.data;
        console.log("🤖 AI Response:", aiMessage); // Log to console
        const finalChat: Chat = {
          ...updatedChat,
          messages: [...updatedChat.messages, aiMessage],
        };
        setSelectedChat(finalChat);
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === currentChat!._id ? finalChat : chat,
          ),
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown Error");
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    const chat = await createChatInternal();
    if (chat) {
      setChats((prev) => [...prev, chat]);
      setSelectedChat(chat);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const token = await getToken();
      await axios.post(
        "/api/chat/delete",
        { chatId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const renameChat = async (chatId: string, newName: string) => {
    try {
      const token = await getToken();
      await axios.post(
        "/api/chat/rename",
        { chatId, name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId ? { ...chat, name: newName } : chat,
        ),
      );
      if (selectedChat?._id === chatId) {
        setSelectedChat((prev) => (prev ? { ...prev, name: newName } : null));
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
      toast.error("Failed to rename chat");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        chats,
        selectedChat,
        setSelectedChat,
        createNewChat,
        deleteChat,
        renameChat,
        sendMessage,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
