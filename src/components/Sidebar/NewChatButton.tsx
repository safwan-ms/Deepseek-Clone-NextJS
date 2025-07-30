import Image from "next/image";
import { assets } from "../../../assets/assets";

interface NewChatBtnProps {
  expand: boolean;
}

const NewChatButton = ({ expand }: NewChatBtnProps) => {
  return (
    <button
      className={`mt-8 flex items-center justify-center cursor-pointer ${
        expand
          ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max"
          : "group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg"
      }`}
    >
      <Image
        className={expand ? "w-6" : "w-7"}
        src={expand ? assets.chat_icon : assets.chat_icon_dull}
        alt="Chat Icon"
      />
      <div className="absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none">
        New Chat
        <div className="w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5"></div>
      </div>
      {expand && <p className="text-white text font-medium">New Chat</p>}
    </button>
  );
};
export default NewChatButton;
