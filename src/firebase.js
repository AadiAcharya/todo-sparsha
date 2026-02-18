import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_DS5C8bmemyLRdrxM6LDkICjL9SUoOqw",
  authDomain: "memo-1b24b.firebaseapp.com",
  projectId: "memo-1b24b",
  storageBucket: "memo-1b24b.firebasestorage.app",
  messagingSenderId: "162519403684",
  appId: "1:162519403684:web:343b00e1f1fe914cad6a31"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);