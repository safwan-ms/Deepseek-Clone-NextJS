import Image from "next/image";
import { assets } from "../../../assets/assets";

type SidebarTogglerTypes = {
  expand: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarToggler = ({ expand, setExpand }: SidebarTogglerTypes) => {
  return (
    <div
      className={`flex items-center ${
        expand ? "justify-between px-2" : "justify-center"
      } mb-6`}
    >
      {/* Logo Area */}
      {expand && (
        <div className="flex items-center gap-2">
          <Image src={assets.logo_text} alt="Deepseek" className="h-6 w-auto" />
        </div>
      )}

      {/* Toggle Button */}
      <div
        onClick={() => setExpand(!expand)}
        className="cursor-pointer text-gray-400 hover:text-white transition-colors"
      >
        <Image
          src={assets.sidebar_icon} // Assuming this is the book-like icon
          alt="Toggle Sidebar"
          className="w-5 h-5 opacity-70 hover:opacity-100"
        />
      </div>
    </div>
  );
};
export default SidebarToggler;
