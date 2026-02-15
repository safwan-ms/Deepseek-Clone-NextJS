import { useState } from "react";
import { useChatContext } from "@/context/ChatContext/ChatContext";
import Image from "next/image";
import { assets } from "../../../assets/assets";

interface ChatLabelProps {
  openMenu: {
    id: string; // Changed to string to match Mongo ID
    open: boolean;
  };
  setOpenMenu: React.Dispatch<
    React.SetStateAction<{
      id: string; // Changed to string
      open: boolean;
    }>
  >;
  expand: boolean;
  onChatSelect?: () => void;
}

const ChatLabel = ({
  openMenu,
  setOpenMenu,
  expand,
  onChatSelect,
}: ChatLabelProps) => {
  const { chats, selectedChat, setSelectedChat, deleteChat, renameChat } =
    useChatContext();
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Toggle menu: close if open on same id, otherwise open on new id
    setOpenMenu((prev) => ({
      id: prev.id === id && prev.open ? "" : id, // Using string id
      open: prev.id === id && prev.open ? false : true,
    }));
  };

  return (
    <div
      className={`mt-8 text-white/25 text-sm ${expand ? "block" : "hidden"} overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pb-20`}
    >
      <p className="my-1 mb-3 ml-2 text-xs font-semibold">Recent</p>
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => {
            setSelectedChat(chat);
            onChatSelect?.();
          }}
          className={`group flex items-center justify-between p-2 rounded-lg text-sm cursor-pointer mb-1 transition-colors ${
            selectedChat?._id === chat._id
              ? "bg-[#404045] text-white"
              : "text-white/80 hover:bg-[#2b2c2f]"
          }`}
        >
          {editId === chat._id ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
              className="bg-transparent border border-[#4a4a4f] rounded px-2 text-white/90 text-[13px] outline-none w-full h-8"
              onClick={(e) => e.stopPropagation()}
              onBlur={() => {
                if (editName.trim() !== "") {
                  renameChat(chat._id, editName.trim());
                }
                setEditId("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  if (editName.trim() !== "") {
                    renameChat(chat._id, editName.trim());
                  }
                  setEditId("");
                }
              }}
            />
          ) : (
            <p className="truncate max-w-[140px]">{chat.name || "New Chat"}</p>
          )}

          <div
            className={`relative flex items-center justify-center h-6 w-6 rounded-md hover:bg-gray-600/50 ${
              selectedChat?._id === chat._id
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            } transition-opacity`}
            onClick={(e) => handleMenuClick(e, chat._id)}
          >
            <Image
              src={assets.three_dots}
              alt="options"
              className="w-4 opacity-70"
            />

            {openMenu.id === chat._id && openMenu.open && (
              <div
                className="absolute right-0 top-8 z-50 bg-[#2b2c2f] border border-gray-700 rounded-lg shadow-xl w-32 py-1 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 text-white/90 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditId(chat._id);
                    setEditName(chat.name || "New Chat");
                    setOpenMenu({ id: "", open: false });
                  }}
                >
                  <Image
                    src={assets.pencil_icon}
                    alt="edit"
                    className="w-3.5"
                  />
                  Rename
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 text-red-400 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat._id);
                    setOpenMenu({ id: "", open: false });
                  }}
                >
                  <Image
                    src={assets.delete_icon}
                    alt="delete"
                    className="w-3.5"
                  />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default ChatLabel;
