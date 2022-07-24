import Head from "next/head";
import Feed from "../../components/SocialMediaComponents/Feed";
import Sidebar from "../../components/SocialMediaComponents/Sidebar";
import Widgets from "../../components/SocialMediaComponents/Widgets";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../../components/SocialMediaComponents/Login";
import Modal from "../../components/SocialMediaComponents/Modal";
import { modalState } from "../../atoms/modalAtom";
import { useRecoilState } from "recoil";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import {
  collection,
  onSnapshot,
  query,
  where,
  setDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import ProfileComp from "../../components/SocialMediaComponents/ProfileComp";
import { ArrowLeftIcon } from "@heroicons/react/outline";

export default function ProfilePage({
  trendingResults,
  followResults,
  providers,
}) {
  const { data: session } = useSession();
  const [user, setUser] = useState();
  //const [isOpen, setIsOpen] = useRecoilState(modalState);

  if (!session) return <Login providers={providers} />;

  let users = [];

  const userRef = collection(db, "users");
  const q = query(userRef, where("id", "==", session.user.uid));
  onSnapshot(q, (snapshot) => {
    setUser(snapshot.docs);
  });

  return (
    <div className="">
      <Head>
        <title> on Bookstagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 text-white" />
            </div>
          </div>
        </div>

        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const trendingResults = await fetch(
    "https://newsapi.org/v2/everything?q=books&apiKey=fc148f9a798147d9a11ec0397cbe8577"
  ).then((res) => res.json());
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  };
}
