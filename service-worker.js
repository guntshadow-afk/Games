// Service Worker for Caching - Required for PWA install prompt

const CACHE_NAME = 'cosmic-gem-clicker-v4';
// List essential files to cache for offline use
const urlsToCache = [
    '/',
    'index.html',
    'manifest.json',
];

self.addEventListener('install', (event) => {
    // Perform install steps and cache static assets
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Opened cache. Caching essential files.');
                return cache.addAll(urlsToCache).catch(err => {
                    console.warn('Service Worker: Failed to cache some resources (CDNs likely):', err);
                });
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Intercept network requests and serve from cache if available
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request);
            }
        )
    );
});

self.addEventListener('activate', (event) => {
    // Clean up old caches
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
