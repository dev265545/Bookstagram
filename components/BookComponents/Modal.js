/* eslint-disable @next/next/no-img-element */
import { db } from "../../firebase";
import { onSnapshot, setDoc, doc, deleteDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { collection } from "@firebase/firestore";
const Modal = ({
  visible,

  thumbnail,
  onClose,
  title,
  infoLink,
  description,
  authors,
  amount,
  id,
}) => {
  const handleOnclose = () => {
    onClose();
  };
  const { data: session } = useSession();
  const [books, setbooks] = useState([]);
  const [bookF, setbookF] = useState(false);
  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", session.user.uid, "books"),
        (snapshot) => setbooks(snapshot.docs)
      ),
    [session.user.uid]
  );

  useEffect(
    () => setbookF(books.findIndex((book) => book.id === id) !== -1),
    [books, id]
  );
  const addTofavourite = async () => {
    if (bookF) {
      await deleteDoc(doc(db, "users", session.user.uid, "books", id));
    } else {
      await setDoc(doc(db, "users", session.user.uid, "books", id), {
        id: id,
        user_id: session.user.uid,
        username: session.user.name,
        userImg: session.user.image,
        tag: session.user.tag,
        book_name: title,
        book_img: thumbnail,
        book_authors: authors,
        book_infolink: infoLink,
      });
    }
  };

  if (!visible) {
    return null;
  }
  return (
    <>
      <>
        <div
          className=" backdrop-blur-md  fade fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto"
          id="exampleModalFullscreen"
          aria-labelledby="exampleModalFullscreenLabel"
          aria-hidden="true"
          onClick={handleOnclose}
        >
          <div className="modal-dialog modal-dialog-scrollable relative w-auto pointer-events-none">
            <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-gray-700 bg-clip-padding rounded-md outline-none text-current">
              <div className="flex flex-col p-6">
                <div className=" flex flex-row">
                  <img
                    className=" w-full h-full md:h-auto object-none md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
                    src={thumbnail}
                    alt={"Not availbale"}
                  />
                  <div className="flex flex-col">
                    <h5 className="text-gray-100 text-xl font-medium mb-2">
                      Title : {title}
                    </h5>
                    <p className="text-gray-100 text-base mb-4">
                      {" "}
                      Author(s) : {authors}{" "}
                    </p>
                    <p className="text-gray-100 text-base mb-4">
                      {" "}
                      Price: &#8377;{amount}
                    </p>
                    <a
                      href={infoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-base mb-4"
                    >
                      {" "}
                      More Info
                    </a>
                    {bookF && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addTofavourite();
                        }}
                        type="button"
                        className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                      >
                        <p>Remove from Favourites</p>
                      </button>
                    )}
                    {bookF == false && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addTofavourite();
                        }}
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <p>Add to Favourites</p>
                      </button>
                    )}
                  </div>
                  <div></div>
                </div>

                <div className=" ">
                  <p className="text-gray-100 text-base"> {description}</p>
                </div>

                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center  p-4 border-t border-gray-200 rounded-b-md"></div>
                <button
                  type="button"
                  className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-900 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Modal;
