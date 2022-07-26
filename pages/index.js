import Head from "next/head";
import Feed from "../components/SocialMediaComponents/Feed";
import Sidebar from "../components/SocialMediaComponents/Sidebar";
import Widgets from "../components/SocialMediaComponents/Widgets";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../components/SocialMediaComponents/Login";
import Modal from "../components/SocialMediaComponents/Modal";
import { modalState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  setDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import background from "../assets/background.jpg";

export default function Home({ trendingResults, providers }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [userset, setUserSet] = useState([]);
  useEffect(
    () =>
      onSnapshot(query(collection(db, "users")), (snapshot) => {
        setUserSet(snapshot.docs);
      }),
    [db]
  );

  if (!session) return <Login providers={providers} />;

  getDoc(doc(db, "users", session.user.uid)).then((docSnap) => {
    if (docSnap.exists()) {
      console.log("user exsits");
    } else {
      console.log("No such document!");
      {
        setDoc(doc(db, "users", session.user.uid), {
          id: session.user.uid,
          tag: session.user.tag,
          username: session.user.name,
          userImg: session.user.image,
          email: session.user.email,
          coverphoto: "https://i.im.ge/2022/07/26/FLevID.jpg",
          bio: "",
          timestamp: serverTimestamp(),
        });
        console.log("success");
      }
    }
  });

  return (
    <div className="">
      <Head>
        <title>Feed | Bookstagram</title>
        <link rel="icon" href="../Bookstagram-logos.ico" />
      </Head>

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <Feed />
        <Widgets trendingResults={trendingResults} />

        {isOpen && <Modal />}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const trendingResults = await fetch(
    "https://newsapi.org/v2/everything?q=books&apiKey=fc148f9a798147d9a11ec0397cbe8577"
  ).then((res) => res.json());

  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingResults,

      providers,
      session,
    },
  };
}
