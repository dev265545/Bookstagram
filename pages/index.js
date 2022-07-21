import Head from "next/head";
import Feed from "../components/SocialMediaComponents/Feed";
import Sidebar from "../components/SocialMediaComponents/Sidebar";
import Widgets from "../components/SocialMediaComponents/Widgets";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../components/SocialMediaComponents/Login";
import Modal from "../components/SocialMediaComponents/Modal";
import { modalState } from "../atoms/modalAtom";
import { Snapshot, useRecoilState } from "recoil";
import { db, storage } from "../firebase";
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
import { useEffect } from "react";

export default function Home({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  console.log(trendingResults);
  if (!session) return <Login providers={providers} />;

  let users = [];
  const userRef = collection(db, "users");
  const q = query(userRef, where("id", "==", session.user.uid));
  onSnapshot(q, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
    });
  });

  if (users.length == 0) {
    setDoc(doc(userRef, session.user.uid), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      email: session.user.email,

      timestamp: serverTimestamp(),
    });
  }

  return (
    <div className="">
      <Head>
        <title>Feed | Bookstagram</title>
        <link rel="icon" href="../Bookstagram-logos.ico" />
      </Head>

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <Feed />
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />

        {isOpen && <Modal />}
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
