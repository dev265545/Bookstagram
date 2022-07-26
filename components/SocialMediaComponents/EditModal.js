/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRecoilState } from "recoil";
import { editmodalState, modalState, postIdState } from "../../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  onSnapshot,
  doc,
  docRef,
  addDoc,
  collection,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  CameraIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";

import { storage } from "../../firebase";
import { updateDoc } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { signOut } from "next-auth/react";
import Moment from "react-moment";

function EditModal({ user }) {
  const { data: session } = useSession();
  const [editmodal, setEditModal] = useRecoilState(editmodalState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const [nameinput, setNameInput] = useState(user[0].username);
  const [bioinput, setBioInput] = useState(user[0].bio);

  console.log(nameinput);

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = doc(db, "users", session.user.uid);
    await updateDoc(docRef, {
      username: nameinput,
      bio: bioinput,
    });

    const imageRef = ref(storage, `users/${docRef.id}/coverphoto`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "users", docRef.id), {
          coverphoto: downloadURL,
        });
      });
    }
    console.log("success");

    setLoading(false);
    setEditModal(false);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  return (
    <Transition.Root show={editmodal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 pt-8"
        onClose={setEditModal}
      >
        <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div className="flex items-center text-white text-xl px-2 gap-3 py-2 border-b border-gray-700">
                <div
                  className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={() => setEditModal(false)}
                >
                  <XIcon className="h-[22px] text-white" />
                </div>
                Edit Profile
              </div>
              <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                  <div className=" w-full h-1/3 flex ">
                    <div
                      className="icon flex-1"
                      onClick={() => filePickerRef.current.click()}
                    >
                      <CameraIcon className="text-[#1d9bf0] h-[40px]" />
                      <input
                        type="file"
                        ref={filePickerRef}
                        hidden
                        onChange={addImageToPost}
                      />
                    </div>
                  </div>
                  <div className=" text-white mt-5 mb-3 md:w-96 xl:w-96">
                    Username :
                    <input
                      onChange={(e) => {
                        setNameInput(e.target.value);
                      }}
                      type="text"
                      className="
        form-control
        block
        w-full
        px-2
        py-1
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                      id="exampleText0"
                      placeholder={nameinput}
                      value={nameinput}
                    />
                  </div>
                  <div className=" text-white mt-5 mb-3 md:w-96 xl:w-96">
                    Bio :
                    <input
                      onChange={(e) => {
                        setBioInput(e.target.value);
                      }}
                      type="text"
                      className="
        form-control
        block
        w-full
        px-2
        py-1
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                      id="exampleText1"
                      placeholder={bioinput}
                      value={bioinput}
                    />
                  </div>
                </div>
              </div>
              <button
                className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                disabled={!nameinput && !selectedFile}
                onClick={() => {
                  sendPost();
                }}
              >
                Post
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default EditModal;
