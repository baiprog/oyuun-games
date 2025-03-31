import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATKydktDUTzlbnW2jeZPM3wSpdfKfaMHo",
  authDomain: "oyuun-games.firebaseapp.com",
  projectId: "oyuun-games",
  storageBucket: "oyuun-games.firebasestorage.app",
  messagingSenderId: "355199527538",
  appId: "1:355199527538:web:72a9d9cc027a4dc3ebb0eb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);