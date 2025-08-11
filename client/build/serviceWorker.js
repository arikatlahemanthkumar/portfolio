// Service Worker for Portfolio App
const CACHE_NAME = 'portfolio-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/fallback.html',
  '/favicon.ico',
  '/manifest.json',
  '/profile-image.jpg',
  '/chatbot.jpg',
  '/ride-share.png',
  '/preload.js'
];

// Assets that should be cached after they're first used
const RUNTIME_CACHE_URLS = [
  // CSS and JS files will be cached at runtime with their hash names
  // since we don't know the exact filenames at service worker registration time
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => console.error('Error caching static assets:', error))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Helper function to determine if a request is a navigation request
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && 
          request.headers.get('accept').includes('text/html'));
}

// Helper to check if a request is for an API
function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// Helper to check if a request is cross-origin
function isCrossOrigin(url) {
  return url.origin !== self.location.origin;
}

// Fetch event - serve from cache or network with improved strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (isCrossOrigin(url)) {
    return;
  }
  
  // Skip API requests - let them go to the network
  if (isApiRequest(url)) {
    return;
  }
  
  // For navigation requests (HTML pages) - network-first strategy
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the latest version of the page
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not in cache either, serve the fallback page
              return caches.match('/fallback.html');
            });
        })
    );
    return;
  }
  
  // For CSS and JS files - cache-first for faster loading, but update cache
  if (event.request.url.match(/\.(css|js)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Return cached response immediately for faster loading
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // Update the cache with the new version in the background
              if (networkResponse && networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseToCache);
                });
              }
              return networkResponse;
            })
            .catch(error => {
              console.error('Fetch error for CSS/JS:', error);
            });
          
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }
  
  // For other requests (images, etc.) - cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response to cache it and return it
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('Fetch error:', error);
            // For image requests, return a default image if available
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/profile-image.jpg');
            }
          });
      })
  );
});

// Listen for messages from the client
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});