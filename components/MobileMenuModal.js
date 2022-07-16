import { React } from "react";
import SidebarLink from "./MobileSidebarLink";
import { HomeIcon } from "@heroicons/react/solid";
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

export default function Example({ setMenuopen }) {
  return (
    <div
      id="medium-modal"
      tabIndex="-1"
      onClick={(e) => {
        setMenuopen(false);
      }}
      className="backdrop-blur overflow-y-auto overflow-x-auto fixed top-0 right-0 left-0 z-50 w-full md:inset-0  md:h-full xl:hidden md:hidden"
    >
      <div className="relative p-4 w-full max-w-lg h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              MENU
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="medium-modal"
              onClick={(e) => setMenuopen(false)}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="space-y-2.5 mt-4 mb-2.5 p-5 xl:ml-24">
            <SidebarLink text="Home" Icon={HomeIcon} active />

            <SidebarLink text="Explore" Icon={HashtagIcon} />
            <SidebarLink text="Notifications" Icon={BellIcon} />
            <SidebarLink text="Messages" Icon={InboxIcon} />
            <SidebarLink text="Bookmarks" Icon={BookmarkIcon} />
            <SidebarLink text="Lists" Icon={ClipboardListIcon} />
            <SidebarLink text="Profile" Icon={UserIcon} />
            <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}
