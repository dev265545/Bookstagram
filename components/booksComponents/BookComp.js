import React, { useState } from "react";
import Modal from "./Modal";
import isUndefined from "./Undefined";

const BookComp = ({
  title,
  authors,
  description,
  publishedDate,
  subtitle,
  thumbnail,
  infoLink,
  amount,
}) => {
  let titleDisplay = "";
  if (!isUndefined(title)) {
    titleDisplay = title;
  }

  let authorDisplay = "";
  if (authors?.length) {
    authorDisplay = authors?.join(",  ");
  }

  const [showModal, setShowModal] = useState(false);
  const [bookitem, setbookItem] = useState();
  const handleOnclose = () => {
    setShowModal(false);
  };
  return (
    <>
      <div className="flex justify-center p-6">
        <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-gray-800 shadow-lg">
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
              src={thumbnail}
              alt="not available"
            />
          )}

          <div className="p-6 flex flex-col justify-start">
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
                }}
              >
                Click here
              </button>
              <Modal
                title={titleDisplay}
                authors={authors}
                description={description}
                visible={showModal}
                modalbook={bookitem}
                thumbnail={thumbnail}
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
