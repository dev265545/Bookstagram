import Head from "next/head";
import Feed from "../components/SocialMediaComponents/Feed";
import Sidebar from "../components/SocialMediaComponents/Sidebar";
import Widgets from "../components/SocialMediaComponents/Widgets";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../components/SocialMediaComponents/Login";
import Modal from "../components/SocialMediaComponents/Modal";
import { modalState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";

export default function Home({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);

  if (!session) return <Login providers={providers} />;

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
  const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
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
