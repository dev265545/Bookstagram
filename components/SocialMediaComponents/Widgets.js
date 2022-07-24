/* eslint-disable @next/next/no-img-element */
import { SearchIcon } from "@heroicons/react/outline";

import Image from "next/image";
import News from "./Trending";
import React, { useState, useEffect } from "react";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../../firebase";

import { signOut } from "next-auth/react";
import { getProviders, getSession, useSession } from "next-auth/react";

import { AnimatePresence, motion } from "framer-motion";
import Follow from "./Follow";

function Widgets({ trendingResults, followResults }) {
  const [articleNum, setArticleNum] = useState(3);
  const [randomUserNum, setRandomUserNum] = useState(3);
  const { data: session } = useSession();
  const [userset, setUserSet] = useState([]);

  useEffect(
    () =>
      onSnapshot(query(collection(db, "users")), (snapshot) => {
        setUserSet(snapshot.docs);
      }),
    [db]
  );

  let data = userset.map(
    (user) => user.data().id != session.user.uid && user.data()
  );

  data = data.filter(isNaN);

  return (
    <div className="hidden lg:inline ml-8 xl:w-[450px] py-1 space-y-5">
      <div className="sticky top-0 py-1.5 bg-black z-50 w-11/12 xl:w-9/12">
        <div className="flex items-center bg-[#202327] p-3 rounded-full relative">
          <SearchIcon className="text-gray-500 h-5 z-50" />
          <input
            type="text"
            className="bg-transparent placeholder-gray-500 outline-none text-[#d9d9d9] absolute inset-0 pl-11 border border-transparent w-full focus:border-[#1d9bf0] rounded-full focus:bg-black focus:shadow-lg"
            placeholder="Search Accounts"
          />
        </div>
      </div>

      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">Whats happening</h4>
        <AnimatePresence>
          {trendingResults?.articles?.slice(0, articleNum).map((article) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <News key={article.title} article={article} />
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => setArticleNum(articleNum + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show more
        </button>
      </div>

      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        {data.slice(0, randomUserNum).map((user) => (
          <Follow key={user.id} user={user} />
        ))}
        <button
          onClick={() => setRandomUserNum(randomUserNum + 3)}
          className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-[#1d9bf0] font-light"
        >
          Show more
        </button>
      </div>
    </div>
  );
}

export default Widgets;
