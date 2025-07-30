import Image from "next/image";
import { assets } from "../../../assets/assets";

const GetAppSection = ({ expand }: { expand: boolean }) => {
  return (
    <div
      className={`flex items-center cursor-pointer group relative ${
        expand
          ? "gap-1 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10"
          : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"
      }`}
    >
      <Image
        className={expand ? "w-5" : "w-6.5 mx-auto"}
        src={expand ? assets.phone_icon : assets.phone_icon_dull}
        alt=""
      />
      {expand && (
        <>
          <span>Get App</span>
          <Image src={assets.new_icon} alt="New Icon" className="w-4 h-4" />
        </>
      )}

      {/* QR Code Tooltip */}
      <div
        className={`absolute -top-60 pb-8 ${
          !expand && "-right-40"
        } opacity-0 group-hover:opacity-100 hidden group-hover:block transition`}
      >
        <div className="relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg">
          <Image src={assets.qrcode} alt="QR Code" className="w-44" />
          <p>Scan to get Deepseek App</p>
          <div
            className={`w-3 h-3 absolute bg-black rotate-45 ${
              expand ? "right-1/2" : "left-4"
            } -bottom-1.5`}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default GetAppSection;
