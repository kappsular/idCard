/**
 * Service Worker for Offline Resilience & Instant NFC Loading
 */
const CACHE_NAME = 'antigravity-card-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './css/style.css',
  './css/admin.css',
  './js/app.js',
  './js/admin.js',
  './js/qrcode.min.js',
  './config.json',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network first for config.json and client profiles to always show freshest details, falling back to cache
  if (event.request.url.includes('config.json') || event.request.url.includes('profiles/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache first for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
