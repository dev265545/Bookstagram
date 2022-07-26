/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { DotsHorizontalIcon, SparklesIcon } from "@heroicons/react/outline";
import { MenuAlt2Icon, CalendarIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Input from "../SocialMediaComponents/Input";
import {
  collection,
  onSnapshot,
  query,
  where,
  setDoc,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { orderBy } from "@firebase/firestore";
import { db } from "../../firebase";
import Post from "../SocialMediaComponents/Post";
import { useSession } from "next-auth/react";
import Sidebar from "./MobileMenuModal";
import Login from "./Login";
import ProfileFollow from "./ProfileFollow";
import FavBooks from "../../pages/FavBooks";
import BookComp from "../BookComponents/BookComp";

function ProfileComp({ data }) {
  const { data: session } = useSession();
  const [followers, setfollowers] = useState([]);
  const [following, setfollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState(1);
  const [favbooks, setFavBooks] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "users", data[0]?.id, "books")),
        (snapshot) => {
          setFavBooks(snapshot.docs);
        }
      ),
    [db]
  );
  let booksuser = favbooks.map((favbook) => favbook.data());

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "users", data[0]?.id, "followers")),
        (snapshot) => {
          setfollowers(snapshot.docs);
        }
      ),
    [db]
  );
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "users", data[0]?.id, "following")),
        (snapshot) => {
          setfollowing(snapshot.docs);
        }
      ),
    [db]
  );
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [db]
  );

  const [menuopen, setMenuopen] = useState(false);
  const handleonsubmit = (e) => {
    setMenuopen(!menuopen);
  };

  if (!session) return <Login providers={providers} />;

  let userpost = posts.map(
    (post) => post.data().user_id == data[0]?.id && post.data()
  );
  let userbooks = booksuser.map((book) => book.user_id == data[0]?.id && book);

  userpost = userpost.filter(isNaN);

  const date = new Timestamp(
    data[0]?.timestamp?.seconds,
    data[0]?.timestamp?.nanoseconds
  )
    .toDate()
    .toDateString();

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
          <h3 className="text-sm sm:text-xl font-bold flex-1">
            {data[0]?.username}
          </h3>
        </div>

        <div className="pb-72">
          <img
            className="border-4 border-black  rounded-md  h-80 w-full "
            src={data[0]?.coverphoto}
          />
          <img
            className="rounded-full border-8 border-black absolute top-72  "
            src={data[0]?.userImg}
          />
          <div className="text-[#d9d9d9] p-2 pt-10 pl-3 mt-auto  xl:ml-auto xl:-mr-5">
            <div className="flex flex-row ">
              <div className="inline leading-5">
                <h2 className="font-bold text-xl">{data[0]?.username}</h2>
                <p className="text-[#6e767d]">@{data[0]?.tag}</p>
              </div>

              <ProfileFollow user={data[0]} />
            </div>
            <div className="text-white font-thin ml-1 gap-2 leading-5 inli mt-10">
              {data[0].bio}
            </div>
            <p className="flex flex-row ml-1 gap-2 mt-5 leading-5 text-[#6e767d]">
              <CalendarIcon className="h-5 text-[#6e767d]" />
              Joined on {date}
            </p>
            <div className="flex flex-row ml-1 gap-2 mt-5 leading-5 text-[#6e767d]">
              <p className="font-bold text-white">{followers.length}</p>{" "}
              Followers{" "}
              <p className="font-bold text-white">{following.length}</p>{" "}
              Following
            </div>
          </div>
          <div className=" grid grid-cols-3 mt-10">
            <button
              onClick={() => setType(1)}
              className=" border-t border-b text-[#6e767d] font-bold p-3 items-center border-gray-300"
            >
              <p className=" flex  justify-center ">Posts</p>
            </button>
            <button
              onClick={() => setType(2)}
              className="text-[#6e767d]  font-bold p-3 items-center border-t border-b border-gray-300"
            >
              <p className=" flex  justify-center ">Favourite Books</p>
            </button>
            <button
              onClick={() => setType(3)}
              className="text-[#6e767d]  font-bold items-end border-t border-b border-gray-300 p-3"
            >
              <p className=" flex  justify-center ">Book Reviews</p>
            </button>
          </div>

          <div className="pb-72">
            {type == 1 &&
              userpost.length > 0 &&
              userpost.map(
                (post) =>
                  post != undefined && (
                    <Post key={post.id} id={post.id} post={post} />
                  )
              )}
            {type == 2 && (
              <div className="grid">
                {userbooks.map((favbook) => (
                  <BookComp
                    subtitle={""}
                    infoLink={favbook.book_infolink}
                    title={favbook.book_name}
                    amount={favbook?.book_price}
                    authors={favbook.book_authors}
                    thumbnail={favbook.book_img}
                    etag={favbook.id}
                    key={favbook.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {menuopen && (
        <Sidebar className="bg-black w-full h-full" setMenuopen={setMenuopen} />
      )}
    </>
  );
}

export default ProfileComp;
