import Image from "next/image";
import { assets } from "../../../assets/assets";

import { useChatContext } from "@/context/ChatContext/ChatContext";

interface NewChatBtnProps {
  expand: boolean;
}

const NewChatButton = ({ expand }: NewChatBtnProps) => {
  const { createNewChat } = useChatContext();

  if (!expand) {
    return (
      <div
        onClick={createNewChat}
        className="flex justify-center cursor-pointer hover:bg-[#303030] p-2 rounded-lg transition-colors"
      >
        <Image
          src={assets.new_icon}
          alt="New Chat"
          className="w-5 h-5 text-gray-400"
          style={{
            filter:
              "invert(0.5) sepia(0) saturate(0) hue-rotate(0deg) brightness(1.2)",
          }}
        />
      </div>
    );
  }

  return (
    <button
      onClick={createNewChat}
      className="flex items-center gap-2 bg-[#303030] hover:bg-[#424242] transition-colors rounded-full px-4 py-2.5 w-full text-white/90 text-sm font-medium mb-4"
    >
      <Image
        className="w-4 h-4 text-gray-400"
        src={assets.new_icon}
        alt=""
        style={{
          filter:
            "invert(0.5) sepia(0) saturate(0) hue-rotate(0deg) brightness(1.2)",
        }}
      />
      <span>New chat</span>
    </button>
  );
};
export default NewChatButton;
