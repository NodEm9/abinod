const CACHE_NAME = "abinod-static-v5";
const STATIC_ASSETS = [
  "/styles.css",
  "/assets/site.js",
  "/assets/contact-form.js",
  "/assets/abinod-mark.svg",
  "/assets/ambiten-mark.svg",
  "/assets/og-abinod.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const acceptsHtml = event.request.headers
    .get("accept")
    ?.includes("text/html");

  if (event.request.mode === "navigate" || acceptsHtml) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => networkResponse)
        .catch(
          () =>
            new Response("This page is temporarily unavailable offline.", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            }),
        ),
    );
    return;
  }

  const isFreshAsset =
    isSameOrigin &&
    (requestUrl.pathname.endsWith(".css") ||
      requestUrl.pathname.endsWith(".js"));

  if (isFreshAsset) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return networkResponse;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        const shouldCache =
          networkResponse.ok &&
          isSameOrigin;

        if (shouldCache) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return networkResponse;
      });
    }),
  );
});
