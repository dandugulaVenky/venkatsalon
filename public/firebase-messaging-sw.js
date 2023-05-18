importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyC7kkeUHVGISrxtvhvSt2LXtpd4mBlbEC4",
  authDomain: "otp-easytym.firebaseapp.com",
  projectId: "otp-easytym",
  storageBucket: "otp-easytym.appspot.com",
  messagingSenderId: "346925092365",
  appId: "1:346925092365:web:6cddd675532707d0178f44",
  measurementId: "G-G4Q8HJK9HZ",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const CACHE_NAME = "my-site-cache";
const CACHE_VERSION = "v5";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME + CACHE_VERSION).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/logo192.png",
        "/logo512.png",
        "/favicon.ico",
      ]);
    })
  );
});

self.addEventListener("push", (event) => {
  const payload = event.data.json();
  console.log("[Service Worker] Push received: ", payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    badge:
      "https://res.cloudinary.com/duk9xkcp5/image/upload/v1675417115/badge_vtanya.png",
    data: {
      url: "https://tendynamic--strong-buttercream-fd0805.netlify.app/getStarted",
    },
    priority: "high",
    category: "alert",
    // Define the Android notification channel
    channel: "high-priority-channel",
  };
  if (
    self.ServiceWorkerRegistration &&
    self.ServiceWorkerRegistration.NotificationChannel
  ) {
    const notificationChannel =
      new self.ServiceWorkerRegistration.NotificationChannel({
        id: "high-priority-channel",
        name: "High Priority Channel",
        description: "Notifications with high priority.",
        priority: 2,
      });
    event.waitUntil(
      self.registration.showNotification(
        notificationTitle,
        notificationOptions,
        notificationChannel
      )
    );
  } else {
    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data.url;
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (
            client.url ===
              "https://main--profound-babka-e67f58.netlify.app/getStarted" &&
            "focus" in client
          ) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
