"use client";
import Image from "next/image";
import { assets } from "../../../assets/assets";
import { useChatContext } from "@/context/ChatContext/ChatContext";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const PromptBox = () => {
  const { sendMessage, isLoading } = useChatContext();
  const { user } = useUser();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    if (!user) {
      toast("Please sign in to send messages");
      router.push("/sign-in");
      return;
    }

    await sendMessage(prompt);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full bg-[#303030] p-2.5 sm:p-3 rounded-[22px] sm:rounded-[26px] transition-all flex flex-col gap-2 border border-[#4a4a4f]`}
    >
      <textarea
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent min-h-[40px] sm:min-h-[44px] text-sm px-2 scrollbar-hide text-white/90 placeholder:text-gray-400"
        rows={1}
        placeholder="Message DeepSeek"
        required
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 border border-[#4a4a4f] px-1.5 sm:px-2 py-1 rounded-full cursor-pointer hover:bg-[#424242] transition">
            <Image
              src={assets.deepthink_icon}
              alt="deepthink"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70"
            />
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-300">
              DeepThink (R1)
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 border border-[#4a4a4f] px-1.5 sm:px-2 py-1 rounded-full cursor-pointer hover:bg-[#424242] transition">
            <Image
              src={assets.search_icon}
              alt="search"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70"
            />
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-300">
              Search
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Image
            className="w-4 sm:w-5 cursor-pointer opacity-60 hover:opacity-100 transition"
            src={assets.pin_icon}
            alt=""
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all ${
              prompt.trim() ? "bg-white" : "bg-[#4a4a4f] cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="w-3 h-3 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Image
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${prompt.trim() ? "brightness-0" : "opacity-40"}`}
                src={assets.arrow_icon}
                alt=""
              />
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
export default PromptBox;
