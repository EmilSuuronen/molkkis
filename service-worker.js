const CACHE_NAME = 'molkkis-v5';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Install Service Worker and activate immediately
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// Activate Service Worker and take over clients immediately
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(cacheNames =>
                Promise.all(
                    cacheNames.map(name => {
                        if (name !== CACHE_NAME) return caches.delete(name);
                    })
                )
            )
        ])
    );
});

// Network-First strategy for live GitHub Pages updates
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response && response.status === 200) {
                    const respClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
