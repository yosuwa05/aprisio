import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );
    console.log("Service Worker Registered:", registration);

    const currentToken = await getToken(messaging, {
      vapidKey:
        "BL4b-mn9seLIs3_5jUdDbB5uvu101KGJUZ1I_Wr73dLXv_JVKUZjPZABtVWd4lOZg8F5yIulFMsm7JhX_mIKKyY",
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      return currentToken;
    } else {
      console.warn("No registration token available.");
    }
    return "";
  } catch (error) {
    console.error("Error getting token", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { db, messaging };
