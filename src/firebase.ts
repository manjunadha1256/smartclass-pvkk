import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "smartclass-pvkk.firebaseapp.com",
  projectId: "smartclass-pvkk",
  storageBucket: "smartclass-pvkk.firebasestorage.app",
  messagingSenderId: "942951521342",
  appId: "1:942951521342:web:5604b849607cbeabef856f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
