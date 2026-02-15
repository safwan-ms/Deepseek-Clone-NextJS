import SidebarToggler from "./SidebarToggler";
import NewChatButton from "./NewChatButton";
import ChatLabel from "./ChatLabel";
import { useState } from "react";
import GetAppSection from "./GetAppSection";
import ProfileLink from "./ProfileLink";

type SidebarProps = {
  expand: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ expand, setExpand }: SidebarProps) => {
  const [openMenu, setOpenMenu] = useState({ id: "", open: false });

  return (
    <div
      className={`flex flex-col justify-between bg-[#1b1b1c] text-[#e0e0e0] transition-all z-50 h-screen border-r border-[#303030] ${
        expand ? "w-[260px] px-3 py-4" : "w-[60px] items-center py-4"
      }`}
    >
      <div className="flex-1 overflow-hidden flex flex-col w-full">
        <SidebarToggler expand={expand} setExpand={setExpand} />
        <NewChatButton expand={expand} />
        <ChatLabel
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          expand={expand}
        />
      </div>

      <div className="flex-shrink-0 w-full mt-4">
        {/* <GetAppSection expand={expand} /> */}{" "}
        {/* Optional: Hide GetApp if not in screenshot */}
        <ProfileLink expand={expand} />
      </div>
    </div>
  );
};
export default Sidebar;
