import Image from "next/image";
import { assets } from "../../../assets/assets";

interface MessageProps {
  role: string;
  content: string;
}

const Message = ({ role, content }: MessageProps) => {
  return (
    <div
      className={`w-full text-sm ${role === "user" ? "flex justify-end" : "flex justify-start"}`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] px-5 py-3 rounded-2xl ${
          role === "user"
            ? "bg-[#303030] text-white rounded-tr-sm"
            : "text-white/90 px-0"
        } group`}
      >
        {/* User actions tooltip */}
        {role === "user" && (
          <div className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-gray-400">
            <Image
              src={assets.copy_icon}
              alt="copy"
              className="w-4 h-4 cursor-pointer hover:text-white"
            />
            <Image
              src={assets.pencil_icon}
              alt="edit"
              className="w-4 h-4 cursor-pointer hover:text-white"
            />
          </div>
        )}

        {/* AI Actions */}
        {role !== "user" && (
          <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3 text-gray-400">
            <Image
              src={assets.copy_icon}
              alt="copy"
              className="w-4 h-4 cursor-pointer hover:text-white"
            />
            <Image
              src={assets.regenerate_icon}
              alt="regen"
              className="w-4 h-4 cursor-pointer hover:text-white"
            />
            <Image
              src={assets.like_icon}
              alt="like"
              className="w-4 h-4 cursor-pointer hover:text-white"
            />
            <Image
              src={assets.dislike_icon}
              alt="dislike"
              className="w-4 h-4 cursor-pointer hover:text-white"
            />
          </div>
        )}

        {role === "user" ? (
          <p className="leading-relaxed">{content}</p>
        ) : (
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <Image
                alt="logo"
                className="h-8 w-8 rounded-full border border-white/10 p-0.5"
                src={assets.logo_icon}
              />
            </div>
            <div className="flex-1 space-y-2 overflow-hidden leading-relaxed">
              {content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Message;
