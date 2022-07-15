import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { handlePostState } from "../atoms/postAtom";
import axios from "axios";
import { Image } from "cloudinary-react";
import EmojiHappyIcon from "@mui/icons-material/EmojiEmotionsOutlined";

import Picker from "emoji-picker-react";

function Form() {
  const [input, setInput] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [imageSelected, setImageSelected] = useState("");
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [handlePost, setHandlePost] = useRecoilState(handlePostState);
  const [showEmojis, setShowEmojis] = useState(false);

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  const uploadImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "wg46o9ez");

    axios
      .post("https://api.cloudinary.com/v1_1/dfx9p6tpc/image/upload", formData)
      .then((response) => {
        setPhotoUrl(response.data.url);
      });
  };
  const uploadPost = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({
        input: input,
        photoUrl: photoUrl,
        username: session.user.name,
        email: session.user.email,
        userImg: session.user.image,
        createdAt: new Date().toString(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    setHandlePost(true);
    setModalOpen(false);
  };

  return (
    <form className="flex flex-col relative space-y-2 text-black/80 dark:text-white/75">
      <textarea
        rows="4"
        placeholder="What do you want to talk about?"
        className="bg-transparent focus:outline-none dark:placeholder-white/75"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <input
        type="file"
        placeholder="Add a photo URL (optional)"
        className="placeholder-white/75 bg-transparent focus:outline-none truncate max-w-xs md:max-w-sm dark:placeholder-white/75"
        onChange={(e) => {
          setImageSelected(e.target.files[0]);
        }}
      />
      <button
        className="bg-gray-700 rounded-full w-1/4 text-white dark:bg-gray-200 dark:text-gray-400 focus:outline-none  border truncate width md:max-w-sm dark:placeholder-white/75"
        onClick={(e) => uploadImage(e)}
      >
        Image Upload
      </button>
      <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
        <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
      </div>

      <button
        className="absolute bottom-0 right-0 font-medium bg-blue-400 hover:bg-blue-500 disabled:text-black/40 disabled:bg-white/75 disabled:cursor-not-allowed text-white rounded-full px-3.5 py-1"
        type="submit"
        onClick={uploadPost}
        disabled={!input.trim() && !photoUrl.trim()}
      >
        Post
      </button>
    </form>
  );
}

export default Form;
