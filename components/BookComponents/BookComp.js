import React, { useState } from "react";
import Modal from "./Modal";
import isUndefined from "./Undefined";
import nocover from "../../assets/Bookstagram-logos_white.png";
import { db, storage } from "../../firebase";
import {
  onSnapshot,
  query,
  where,
  setDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";

import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";

const BookComp = ({
  title,
  authors,
  description,
  publishedDate,
  subtitle,
  thumbnail,
  infoLink,
  amount,
  etag,
}) => {
  let titleDisplay = "";
  if (!isUndefined(title)) {
    titleDisplay = title;
  }

  let authorDisplay = "";
  if (authors?.length) {
    authorDisplay = authors?.join(",  ");
  }
  let thumbnailDisplay = "";
  if (thumbnail != undefined) {
    thumbnailDisplay = thumbnail;
  } else {
    thumbnailDisplay =
      "data:image/gif;base64,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";
  }

  const [showModal, setShowModal] = useState(false);

  const [bookitem, setbookItem] = useState();
  const handleOnclose = () => {
    setShowModal(false);
  };

  let favouriteBooks = [];
  const bookRef = collection(db, "books");

  const onClickHanlde = () => {
    const q = query(bookRef, where("id", "==", etag));
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        favouriteBooks.push({ ...doc.data(), id: doc.id });
      });
    });

    console.log(favouriteBooks);
  };

  return (
    <>
      <div className="flex justify-center p-6">
        <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-gray-800 shadow-lg">
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="  md:h-auto object-none md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
              src={thumbnailDisplay}
              alt="not available"
            />
          )}

          <div className="p-2 flex flex-col justify-start">
            <h5 className="text-gray-100 text-xl font-medium mb-2">
              {titleDisplay}
            </h5>
            <p className="text-gray-100 text-base mb-4">{subtitle}</p>
            <p className="text-gray-100 text-base">{authorDisplay}</p>
            <p className="text-gray-100 text-base mb-4">
              {" "}
              Price: &#8377;{amount}
            </p>
            <div className="flex space-x-2 justify-center">
              <button
                className="bg-blue-200 text-black active:bg-blue-500 
  font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={() => {
                  setShowModal(true);
                  onClickHanlde;
                }}
              >
                Click here
              </button>
              <Modal
                title={titleDisplay}
                id={etag}
                authors={authors}
                description={description}
                visible={showModal}
                modalbook={bookitem}
                thumbnail={thumbnailDisplay}
                amount={amount}
                onClose={handleOnclose}
                infoLink={infoLink}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookComp;
