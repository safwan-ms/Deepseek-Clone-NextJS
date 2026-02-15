import Image from "next/image";
import { useAppContext } from "../../../contexts/AppContext";
import { assets } from "../../../assets/assets";
import { useClerk, UserButton } from "@clerk/nextjs";

const ProfileLink = ({ expand }: { expand: boolean }) => {
  const { user } = useAppContext();
  const { openSignIn } = useClerk();

  return (
    <div
      onClick={!user ? () => openSignIn?.() : undefined}
      className={`flex items-center ${
        expand ? "hover:bg-[#303030] rounded-lg px-2" : "justify-center"
      } gap-3 text-white/80 text-sm p-2 cursor-pointer transition-colors`}
    >
      {user ? (
        <div className="w-7 h-7 rounded-full overflow-hidden">
          <UserButton
            appearance={{ elements: { userButtonAvatarBox: "w-7 h-7" } }}
          />
        </div>
      ) : (
        <Image src={assets.profile_icon} alt="" className="w-7 opacity-70" />
      )}

      {expand && (
        <>
          <div className="flex-1 truncate font-medium text-sm">
            {user?.fullName || "User"}
          </div>
          <Image
            src={assets.three_dots}
            alt="Options"
            className="w-4 h-4 opacity-60"
          />
        </>
      )}
    </div>
  );
};
export default ProfileLink;
