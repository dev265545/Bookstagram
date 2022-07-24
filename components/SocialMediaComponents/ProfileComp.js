import { SparklesIcon } from "@heroicons/react/outline";
import { MenuAlt2Icon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Input from "../SocialMediaComponents/Input";

import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../../firebase";
import Post from "../SocialMediaComponents/Post";
import { useSession } from "next-auth/react";
import Sidebar from "./MobileMenuModal";

function ProfileComp() {
  const { data: session } = useSession();

  const [menuopen, setMenuopen] = useState(false);
  const handleonsubmit = (e) => {
    setMenuopen(!menuopen);
  };

  // MESSY
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     query(collection(db, "posts"), orderBy("timestamp", "desc")),
  //     (snapshot) => {
  //       setPosts(snapshot.docs);
  //     }
  //   );

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [db]);

  // CLEAN

  return (
    <>
      <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
        <div className="text-[#d9d9d9]  flex flex-row  sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
          <div
            onClick={(e) => handleonsubmit(e)}
            className="hoverAnimation w-9 h-9 xl:hidden md:hidden p-2 "
          >
            <MenuAlt2Icon className="h-5 text-white " />
          </div>
          <h2 className="text-lg sm:text-xl font-bold flex-1">
            {session.user.name}
          </h2>
        </div>

        <div className="pb-72"></div>
      </div>

      {menuopen && (
        <Sidebar className="bg-black w-full h-full" setMenuopen={setMenuopen} />
      )}
    </>
  );
}

export default ProfileComp;
