importScripts(
  "https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyA32YAG8c3mIlhUcLUtIYJ6dvNTAZ1l9mE",
  authDomain: "aprisio-57e02.firebaseapp.com",
  projectId: "aprisio-57e02",
  storageBucket: "aprisio-57e02.firebasestorage.app",
  messagingSenderId: "148866387455",
  appId: "1:148866387455:web:78384101e9fd52e71e6bca",
  measurementId: "G-9ZVS13XKF3",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png", // Make sure you have an icon
  });
});
