import React, { useState, useEffect } from "react";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/BookComponents/Navbar";

import { signOut } from "next-auth/react";
import { getProviders, getSession, useSession } from "next-auth/react";
import BookComp from "../components/BookComponents/BookComp";
import Login from "../components/SocialMediaComponents/Login";
const navigation = [
  { name: "Feed", href: "/", current: false },
  { name: "Explore", href: "/Explore", current: false },
  { name: "Favourite Books", href: "/FavBooks", current: true },
  // { name: "Calendar", href: "#", current: false },
];

function FavBooks({ providers }) {
  const { data: session } = useSession();
  const [favbooks, setFavBooks] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "users", session.user.uid, "books")),
        (snapshot) => {
          setFavBooks(snapshot.docs);
        }
      ),
    [db]
  );
  let data = favbooks.map((favbook) => favbook.data());

  if (!session) return <Login providers={providers} />;
  return (
    <>
      <Navbar navigation={navigation} />
      <div className="pb-72 text-white bg-slate-500">
        <div className="grid grid-cols-3">
          {data.map((favbook) => (
            <BookComp
              subtitle={""}
              infoLink={favbook.book_infolink}
              title={favbook.book_name}
              amount={456}
              authors={favbook.book_authors}
              thumbnail={favbook.book_img}
              etag={favbook.id}
              key={favbook.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default FavBooks;

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      providers,
      session,
    },
  };
}
