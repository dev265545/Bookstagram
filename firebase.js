import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyByePg0paAUna-E4aa0lBFjuQkdMhcJs8M",
  authDomain: "bookstgram-353520.firebaseapp.com",
  projectId: "bookstgram-353520",
  storageBucket: "bookstgram-353520.appspot.com",
  messagingSenderId: "477148949587",
  appId: "1:477148949587:web:203cfdde7fafad7f4f2aa6",
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
