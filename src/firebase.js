import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD_-dkC1ekzf5wMxYufFAk3f5i4nXB3yDk",
    authDomain: "smart-fall-detection.firebaseapp.com",
    projectId: "smart-fall-detection",
    storageBucket: "smart-fall-detection.firebasestorage.app",
    messagingSenderId: "1060840992929",
    appId: "1:1060840992929:web:8c3fc6bbf9860e6ad5c0e0"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);