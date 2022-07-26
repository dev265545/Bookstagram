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
import { editmodalState } from "../../atoms/modalAtom";
import { useRecoilState } from "recoil";

function ProfileFollow({ user }) {
  const { data: session } = useSession();
  const [following, setfollowing] = useState([]);
  const [currentfollowing, setcurrentfollowing] = useState(false);
  const [editmodal, setEditModal] = useRecoilState(editmodalState);

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
        following.findIndex((follow) => follow.id === user?.id) !== -1
      ),
    [following, user?.id]
  );

  const addtoFollwing = async () => {
    if (currentfollowing) {
      await deleteDoc(
        doc(db, "users", session.user.uid, "following", user?.id)
      );
      await deleteDoc(doc(db, "users", user.id, "followers", session.user.uid));
    } else {
      await setDoc(doc(db, "users", session.user.uid, "following", user?.id), {
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
      className="  ml-96 bg-black text-white rounded-full border border-gray-400 font-bold text-sm  hover:bg-white hover:bg-opacity-[0.03] px-5 py-2 cursor-pointer transition duration-200 ease-out flex items-center"
      key={user?.id}
    >
      {user?.id === session.user.uid && currentfollowing == false && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditModal(true);
          }}
          className="ml-auto bg-black text-white  rounded-full font-bold text-sm py-1.5 px-5"
        >
          Edit
        </button>
      )}
      {currentfollowing == false && user?.id !== session.user.uid && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addtoFollwing();
          }}
          className="ml-auto bg-black text-white  rounded-full font-bold text-sm py-1.5 px-5"
        >
          Follow
        </button>
      )}
      {currentfollowing == true && user?.id !== session.user.uid && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addtoFollwing();
          }}
          className="ml-auto bg-black text-white  rounded-full font-bold text-sm py-1.5 px-5"
        >
          Unfollow
        </button>
      )}
    </div>
  );
}

export default ProfileFollow;
