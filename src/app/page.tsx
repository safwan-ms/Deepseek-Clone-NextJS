"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import Sidebar from "@/components/Sidebar/Sidebar";
import PromptBox from "@/components/ChatInput/PromptBox";
import Message from "@/components/Message/Message";
import { useChatContext } from "@/context/ChatContext/ChatContext";

const Home = () => {
  const [expand, setExpand] = useState<boolean>(false);
  const { selectedChat, isLoading } = useChatContext();

  // Scroll to bottom on new message
  useEffect(() => {
    if (selectedChat?.messages || isLoading) {
      const anchor = document.getElementById("bottom-scroll-anchor");
      anchor?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.messages, isLoading]);

  return (
    <div className="min-h-screen bg-[#151517] text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col h-screen bg-[#151517] text-white relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sticky top-0 bg-[#151517] z-10 w-full">
            <div className="flex items-center gap-2 md:hidden">
              <Image
                onClick={() => setExpand(true)}
                className="cursor-pointer w-6 h-6"
                src={assets.menu_icon}
                alt="menu_icon"
              />
            </div>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {!selectedChat || selectedChat.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex items-center gap-3 mb-4">
                  <Image src={assets.logo_icon} alt="" className="h-12 w-12" />
                </div>
                <p className="text-xl font-medium mb-8">
                  Hi, I&apos;m Deepseek
                </p>
                <p className="text-sm text-gray-400">
                  How can I help you today?
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 py-4">
                {selectedChat.messages.map((msg, index) => (
                  <Message key={index} role={msg.role} content={msg.content} />
                ))}
                {isLoading && (
                  <div className="flex justify-start w-full text-sm">
                    <div className="relative max-w-[85%] sm:max-w-[75%] px-0 py-3 rounded-2xl text-white/90 group">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            alt="logo"
                            className="h-8 w-8 rounded-full border border-white/10 p-0.5 animate-pulse"
                            src={assets.logo_icon}
                          />
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden leading-relaxed flex items-center">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div id="bottom-scroll-anchor"></div>
              </div>
            )}
          </div>

          {/* Footer / Prompt Area */}
          <div className="w-full max-w-4xl mx-auto px-4 pb-6 pt-2 bg-[#151517]">
            <PromptBox />
            <p className="text-[10px] text-center mt-3 text-gray-500">
              AI-generated, for reference only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
