import Image from "next/image";
import { HomeIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import SidebarLink from "./SidebarLink";
import { signOut } from "next-auth/react";
import logo from "../../assets/Bookstagram-logos_white.png";
import { useSession } from "next-auth/react";

function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="sm:flex flex-col items-center xl:items-start xl:hidden xl:w-[340px] p-2 fixed h-full bg-black">
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <Image src={logo} width={80} height={80} alt="LOGO" />
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
        <SidebarLink text="Home" Icon={HomeIcon} link="/" active />
        <SidebarLink text="Explore" Icon={HashtagIcon} link="/Explore" />
        {/* <SidebarLink
          text="Notifications"
          Icon={BellIcon}
          link="/Notifications"
        /> */}

        {/* <SidebarLink text="Messages" link="/Explore" Icon={InboxIcon} /> */}

        <SidebarLink text="Bookmarks" link="/FavBooks" Icon={BookmarkIcon} />
        {/* <SidebarLink text="Lists" link="/Explore" Icon={ClipboardListIcon} /> */}
        <SidebarLink
          text="Profile"
          link={`/Profile/${session.user.uid}`}
          Icon={UserIcon}
        />
        <SidebarLink text="More" link="/More" Icon={DotsCircleHorizontalIcon} />
      </div>
      <button className="hidden xl:inline ml-auto bg-[#1d9bf0] text-white rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#1a8cd8]">
        Post
      </button>
      <div
        className="text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation xl:ml-auto xl:-mr-5"
        onClick={signOut}
      >
        <img
          src={session.user.image}
          alt=""
          className="h-10 w-10 rounded-full xl:mr-2.5"
        />
        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold">{session.user.name}</h4>
          <p className="text-[#6e767d]">@{session.user.tag}</p>
        </div>
        <DotsHorizontalIcon className="h-5 hidden xl:inline ml-10" />
      </div>
    </div>
  );
}

export default Sidebar;
