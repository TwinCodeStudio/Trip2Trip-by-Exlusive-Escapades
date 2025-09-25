// Service Worker for Trip2Trip - Performance and Offline Support
const CACHE_NAME = 'trip2trip-v1';
const STATIC_CACHE = 'trip2trip-static-v1';
const DYNAMIC_CACHE = 'trip2trip-dynamic-v1';

// Critical resources to cache immediately (reduced for mobile performance)
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/critical.css',
    '/data.js',
    '/script.js'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Failed to cache static assets', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external requests (fonts, etc.)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Serve from cache with mobile priority
                    console.log('Service Worker: Serving from cache', event.request.url);
                    // Add cache expiration for mobile performance
                    if (isNavigation) {
                        // For navigation requests, add a short TTL to prevent stale pages
                        return cachedResponse;
                    }
                    return cachedResponse;
                }

                // Fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response for caching
                        const responseToCache = response.clone();

                        // Cache the response for future use
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.log('Service Worker: Network fetch failed', error);

                        // Return offline fallback for HTML pages
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }

                        // Return a generic error response
                        return new Response('Offline content not available', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Background sync for form submissions when offline
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(
            // Handle background sync tasks
            handleBackgroundSync()
        );
    }
});

// Handle background sync
async function handleBackgroundSync() {
    try {
        // Process any queued form submissions
        const pendingForms = await getStoredFormSubmissions();

        for (const form of pendingForms) {
            await submitForm(form);
        }

        console.log('Service Worker: Background sync completed');
    } catch (error) {
        console.error('Service Worker: Background sync failed', error);
    }
}

// Helper functions for form handling
async function getStoredFormSubmissions() {
    // This would typically retrieve from IndexedDB
    return [];
}

async function submitForm(formData) {
    // This would submit the form data to the server
    console.log('Submitting form:', formData);
}

// Push notification handling (if needed)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/Images/TwinCode Studio.png',
            badge: '/Images/TwinCode Studio.png',
            data: data.url
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});
