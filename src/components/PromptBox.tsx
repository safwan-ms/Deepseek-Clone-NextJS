"use client";
import Image from "next/image";
import { assets } from "../../assets/assets";
import { useState } from "react";

type PromptBoxProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const PromptBox = ({ isLoading, setIsLoading }: PromptBoxProps) => {
  const [prompt, setPrompt] = useState("");
  return (
    <form
      className={`w-full ${
        false ? "max-w-3xl" : "max-w-2xl"
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all flex flex-col gap-4`}
    >
      <textarea
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent min-h-[60px]"
        rows={2}
        placeholder="Message Deepseek"
        required
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image
              src={assets.deepthink_icon}
              alt="deepthink_icon"
              className="h-5"
            />
            DeepThink (R1)
          </p>

          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.search_icon} alt="search_icon" className="h-5" />
            Search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
          <button
            className={`${
              prompt ? "bg-primary" : "bg-[#71717a]"
            } rounded-full p-2 cursor-pointer`}
          >
            <Image
              className="w-3.5 aspect-square"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  );
};
export default PromptBox;
