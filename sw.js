const CACHE_NAME = 'dalat-360-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './globals.css',
  './script.js',
  './data.js',
  './image/logo_Doan.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Trả về file từ cache
        }
        return fetch(event.request).catch(() => {
            // Khi offline và không có cache, có thể fallback
        });
      })
  );
});
