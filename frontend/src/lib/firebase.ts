import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA32YAG8c3mIlhUcLUtIYJ6dvNTAZ1l9mE",
  authDomain: "aprisio-57e02.firebaseapp.com",
  projectId: "aprisio-57e02",
  storageBucket: "aprisio-57e02.firebasestorage.app",
  messagingSenderId: "148866387455",
  appId: "1:148866387455:web:78384101e9fd52e71e6bca",
  measurementId: "G-9ZVS13XKF3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
