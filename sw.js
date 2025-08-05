const CACHE_NAME = 'qr-scanner-v1';
const urlsToCache = [
  './qr-scanner.html',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js'
];

// API URLs that should not be cached
const apiUrls = [
  'https://script.google.com/macros/s/AKfycbwguKy88PFo1wJz-1l1nZtqyJqpyWArgVZ_pIt-0gtwBFn3J4z44XhIdxKeHu2s04E/exec',
  'https://script.google.com/macros/s/AKfycby_guyHzN9bw7pTN2zZnBayNdOq73yVRbQ7YqJRgE8KKtQ7AO5ZVNVTbcScmilILqEX/exec'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Don't cache API calls - always fetch from network
  if (apiUrls.some(apiUrl => url.href.includes(apiUrl))) {
    event.respondWith(
      fetch(event.request)
        .catch(error => {
          console.log('API fetch failed, returning offline response:', error);
          // Return a simple response for API failures
          return new Response('INVALID', {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }
  
  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 