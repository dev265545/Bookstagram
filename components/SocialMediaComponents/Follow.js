import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  onSnapshot,
  collection,
  setDoc,
  doc,
  deleteDoc,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { getProviders, getSession, useSession } from "next-auth/react";

function Follow({ user }) {
  const { data: session } = useSession();
  const [following, setfollowing] = useState([]);
  const [currentfollowing, setcurrentfollowing] = useState(false);
  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", session.user.uid, "following"),
        (snapshot) => setfollowing(snapshot.docs)
      ),
    [session.user.uid]
  );
  useEffect(
    () =>
      setcurrentfollowing(
        following.findIndex((follow) => follow.id === user.id) !== -1
      ),
    [following, user.id]
  );

  const addtoFollwing = async () => {
    if (currentfollowing) {
      await deleteDoc(doc(db, "users", session.user.uid, "following", user.id));
      await deleteDoc(doc(db, "users", user.id, "followers", session.user.uid));
    } else {
      await setDoc(doc(db, "users", session.user.uid, "following", user.id), {
        id: user.id,
        user_id: session.user.uid,
        follow_username: user.username,
        follow_userImg: user.userImg,
        follow_tag: user.tag,
        follow_email: user.email,
      });
      await setDoc(doc(db, "users", user.id, "followers", session.user.uid), {
        id: session.user.uid,
        user_id: user.id,
        follower_username: session.user.name,
        follower_userImg: session.user.image,
        follower_tag: session.user.tag,
        follower_email: session.user.email,
      });
    }
  };
  return (
    <div
      className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center"
      key={user.id}
    >
      <Image
        alt="hello"
        src={user.userImg}
        width={50}
        height={50}
        objectFit="cover"
        className="rounded-full"
      />
      <div className="ml-4 leading-5 group">
        <h4 className="font-bold group-hover:underline">{user.username}</h4>
        <h5 className="text-gray-500 text-[15px]">{user.tag}</h5>
      </div>
      {currentfollowing == false && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addtoFollwing();
          }}
          className="ml-auto bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5"
        >
          Follow
        </button>
      )}
      {currentfollowing == true && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addtoFollwing();
          }}
          className="ml-auto bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5"
        >
          Unfollow
        </button>
      )}
    </div>
  );
}

export default Follow;
