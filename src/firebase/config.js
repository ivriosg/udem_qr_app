import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCchqNygFoLrkBUhF3CQ8MJPwRCmn7YI3Q",
  authDomain: "registro-udem-checkin.firebaseapp.com",
  projectId: "registro-udem-checkin",
  storageBucket: "registro-udem-checkin.firebasestorage.app",
  messagingSenderId: "184762574802",
  appId: "1:184762574802:web:1a21f0b034faa927b08a0b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
