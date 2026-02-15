"use client";
import SidebarToggler from "./SidebarToggler";
import NewChatButton from "./NewChatButton";
import ChatLabel from "./ChatLabel";
import { useState, useEffect, useCallback } from "react";
import ProfileLink from "./ProfileLink";

type SidebarProps = {
  expand: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ expand, setExpand }: SidebarProps) => {
  const [openMenu, setOpenMenu] = useState({ id: "", open: false });
  const [isMobile, setIsMobile] = useState(false);

  // Track screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on mobile when a chat is selected
  const handleChatSelect = useCallback(() => {
    if (isMobile) {
      setExpand(false);
    }
  }, [isMobile, setExpand]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expand && isMobile) {
        setExpand(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expand, isMobile, setExpand]);

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobile && expand && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
          onClick={() => setExpand(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          flex flex-col justify-between bg-[#1b1b1c] text-[#e0e0e0] 
          transition-all duration-300 ease-in-out h-screen border-r border-[#303030]
          ${
            isMobile
              ? `fixed top-0 left-0 z-50 w-[280px] px-3 py-4 ${
                  expand ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                }`
              : `relative z-50 ${
                  expand ? "w-[260px] px-3 py-4" : "w-[60px] items-center py-4"
                }`
          }
        `}
      >
        <div className="flex-1 overflow-hidden flex flex-col w-full">
          <SidebarToggler
            expand={isMobile ? true : expand}
            setExpand={setExpand}
          />
          <NewChatButton expand={isMobile ? true : expand} />
          <ChatLabel
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            expand={isMobile ? true : expand}
            onChatSelect={handleChatSelect}
          />
        </div>

        <div className="flex-shrink-0 w-full mt-4">
          <ProfileLink expand={isMobile ? true : expand} />
        </div>
      </div>
    </>
  );
};
export default Sidebar;
