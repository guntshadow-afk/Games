// Service Worker for Celestial Miner RPG
const CACHE_NAME = 'celestial-miner-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;700;900&display=swap'
    // The placeholder icon images are generally fetched dynamically but linking main assets is key
];

// Install event: Caches all necessary files
self.addEventListener('install', event => {
    console.log('[Service Worker] Install event: Caching Shell');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Failed to cache during install:', err);
            })
    );
});

// Fetch event: Serves files from cache first, then network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request);
            })
    );
});

// Activate event: Clears old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate event: Removing old caches');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
