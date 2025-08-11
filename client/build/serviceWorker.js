// Service Worker for Portfolio App
const CACHE_NAME = 'portfolio-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/fallback.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/favicon.ico',
  '/manifest.json',
  '/static/media/profile.jpg' // Assuming there's a profile image
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

// Fetch event - serve from cache or network
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
  
  // For navigation requests (HTML pages)
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails, serve the fallback page
          return caches.match('/fallback.html');
        })
    );
    return;
  }
  
  // For other requests (CSS, JS, images, etc.)
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
            // For image requests, you could return a default image
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/static/media/placeholder.jpg');
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