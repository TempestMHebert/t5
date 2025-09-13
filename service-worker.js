// service-worker.js

const CACHE_NAME = "workout-app-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/createWorkout.html",
  "/styles.css",
  "/script.js",
  "/createWorkout.js",
  "/manifest.json",
  "/icons/bolt.png",
  "https://kit.fontawesome.com/42639f9b64.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
