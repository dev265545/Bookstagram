import Head from "next/head";
import Feed from "../../components/SocialMediaComponents/Feed";
import Sidebar from "../../components/SocialMediaComponents/Sidebar";
import Widgets from "../../components/SocialMediaComponents/Widgets";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../../components/SocialMediaComponents/Login";
import Modal from "../../components/SocialMediaComponents/Modal";
import { editmodalState, modalState } from "../../atoms/modalAtom";
import { useRecoilState } from "recoil";
import Router from "next/router";
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
import Loader from "../../components/SocialMediaComponents/Loader";
import EditModal from "../../components/SocialMediaComponents/EditModal";

export default function ProfilePage({
  trendingResults,
  followResults,
  providers,
}) {
  const { data: session } = useSession();
  const [user, setUser] = useState();
  const [userset, setUserSet] = useState([]);
  const [isowner, setIsOwner] = useState(false);
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [editmodal, setEditModal] = useRecoilState(editmodalState);
  const router = useRouter();
  const id = router.query.profileid;

  useEffect(
    () =>
      onSnapshot(query(collection(db, "users")), (snapshot) => {
        setUserSet(snapshot.docs);
      }),
    [db]
  );

  let data = userset.map((user) => user.data().id == id && user.data());

  data = data.filter(isNaN);

  if (!session) return <Login providers={providers} />;

  return (
    <div className="">
      <Head>
        <title> Profile|Bookstagram </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        {data[0] !== undefined ? (
          <ProfileComp data={data} />
        ) : (
          <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
            {" "}
            <Loader />
          </div>
        )}
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
        {isOpen && <Modal />}
        {editmodal && <EditModal user={data} />}
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
