import SidebarToggler from "./SidebarToggler";
import NewChatButton from "./NewChatButton";
import ChatLabel from "../ChatLabel";
import { useState } from "react";
import GetAppSection from "./GetAppSection";
import ProfileLink from "./ProfileLink";

type SidebarProps = {
  expand: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ expand, setExpand }: SidebarProps) => {
  const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

  return (
    <div
      className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${
        expand ? "p-4 w-64" : "md:w-20 w-0 max-md:overflow-hidden"
      }`}
    >
      <div>
        <SidebarToggler expand={expand} setExpand={setExpand} />
        <NewChatButton expand={expand} />
        <ChatLabel
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          expand={expand}
        />
      </div>

      <div className="mb-5">
        <GetAppSection expand={expand} />
        <ProfileLink expand={expand} />
      </div>
    </div>
  );
};
export default Sidebar;
