import { Firestore } from "firebase/firestore";
import { db } from "../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
export async function createFav(title, id, thumbnail, authors, infoLink, uid) {
  try {
    const docRef = await setDoc(doc(db, "users", uid, "books", id), {
      id: id,
      user_id: uid,

      book_name: title,
      book_img: thumbnail,
      book_authors: authors,
      book_infolink: infoLink,
    });
    console.log("Tutorial created with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding Tutorial: ", error);
  }
}
