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
        expand ? "hover:bg-white/10 rounded-lg" : "justify-center w-full"
      } gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}
    >
      {user ? (
        <UserButton />
      ) : (
        <Image src={assets.profile_icon} alt="" className="w-7" />
      )}

      {expand && <span>My Profile</span>}
    </div>
  );
};
export default ProfileLink;
