import { Firestore } from "firebase/firestore";
import { db } from "../../firebase";
import { collection, querySnapshot, doc } from "firebase/firestore";
export function deleteFav(id, user_id) {
  var dt = doc(db, "users", user_id, "books").where("id", "==", id);
  return dt.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      doc.ref.delete();
      console.log("deleted!");
    });
  });
}
