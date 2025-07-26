"use client";
import Image from "next/image";
import { useState } from "react";
import { assets } from "../../assets/assets";

const Home = () => {
  const [expand, setExpand] = useState<boolean>(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#1e1f22] text-white">
      <div className="flex h-screen">
        {/* Sidebar */}

        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8 bg-[#292a2d] shadow-lg rounded-r-2xl relative transition-all duration-300 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <div className="md:hidden absolute top-6 left-0 w-full px-4 flex items-center justify-between">
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180 cursor-pointer hover:scale-105 transition-transform duration-200 w-6 h-6"
              src={assets.menu_icon}
              alt="menu_icon"
            />
            <Image
              className="opacity-80 hover:opacity-100 transition-opacity duration-200 w-6 h-6"
              src={assets.chat_icon}
              alt="chat_icon"
            />
          </div>
          {messages.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image src={assets.logo_icon} alt="" className="h-16" />
                <p className="text-2xl font-medium">Hi, I&apos;m Deepseek</p>
              </div>
              <p className="text-sm mt-2">How can I help you today?</p>
            </>
          ) : (
            <div></div>
          )}
          {/* Prompt box */}
          <p className="text-xs absolute bottom-1 text-gray-500">
            AI-generated, for reference only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
