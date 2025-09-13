const CACHE_NAME = "workout-app-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/createWorkout.html",  // make sure this matches your actual filename!
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
  if (event.request.mode === 'navigate') {
    // Handle navigation requests — fallback to cached index.html
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || caches.match('/index.html');
      }).catch(() => {
        // Optional: fallback if offline and no cached page
        return new Response('You are offline and the page is not cached.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' }),
        });
      })
    );
  } else {
    // For non-navigation requests, respond from cache first, then network
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});