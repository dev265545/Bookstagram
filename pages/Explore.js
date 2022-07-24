import React, { useState } from "react";

import Navbar from "../components/BookComponents/Navbar";
import Image from "next/image";
import pic3 from "../assets/vecteezy_the-female-character-she-searched-for-books-to-read-from_5611509.svg";
import axios from "axios";
import { signOut } from "next-auth/react";
import { getProviders, getSession, useSession } from "next-auth/react";
import BookComp from "../components/BookComponents/BookComp";
import Login from "../components/SocialMediaComponents/Login";
const navigation = [
  { name: "Feed", href: "/", current: false },
  { name: "Explore", href: "/Explore", current: true },
  { name: "Favourite Books", href: "/FavBooks", current: false },
  // { name: "Calendar", href: "#", current: false },
];

function Search({ providers }) {
  const { data: session } = useSession();

  const [Search, setSearch] = useState("");
  const [BookData, setBookData] = useState([]);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    axios
      .get(
        "https://www.googleapis.com/books/v1/volumes?q=" +
          Search +
          "&maxResults=39&key=AIzaSyByePg0paAUna-E4aa0lBFjuQkdMhcJs8M"
      )
      .then((res) => setBookData(res.data.items))
      .catch((err) => console.log(err));
  };

  if (!session) return <Login providers={providers} />;
  return (
    <>
      <section className="w-full h-full bg-blue-200  ">
        <div>
          <Navbar navigation={navigation} />
        </div>
        <div>
          <div className="grid place-items-center">
            <Image src={pic3} height={500} width={650} />
          </div>
          <form onSubmit={onSubmitHandler}>
            <div className="flex  items-center max-w-md mx-auto  rounded border-0 p-3">
              <div className=" items-center relative w-full ">
                <input
                  type="search"
                  value={Search}
                  onChange={(e) => setSearch(e.target.value)}
                  id="search-dropdown"
                  className="block p-2.5  w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-full border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                  placeholder="Search Books "
                  required
                />
                <button
                  type="submit"
                  className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-full border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="grid xl:grid-cols-3">
          {BookData?.map((book) => (
            <>
              <BookComp
                subtitle={book.volumeInfo?.subtitle}
                infoLink={book.volumeInfo?.infoLink}
                amount={book.saleInfo.listPrice?.amount}
                title={book.volumeInfo.title}
                authors={book.volumeInfo.authors}
                publishedDate={book.volumeInfo.publishedDate}
                thumbnail={book.volumeInfo.imageLinks?.smallThumbnail}
                description={book.volumeInfo.description}
                etag={book.id}
              />
            </>
          ))}
        </div>
      </section>
    </>
  );
}

export default Search;

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
