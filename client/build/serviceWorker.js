// Service Worker for Portfolio App
const CACHE_NAME = 'portfolio-cache-v4'; // Increment cache version for deployment
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/fallback.html',
  '/favicon.ico',
  '/manifest.json',
  '/profile-image.jpg',
  '/chatbot.jpg',
  '/ride-share.png',
  '/preload.js',
  '/static/css/main.css',
  '/static/js/main.js'
];

// URLs that should never be cached
const NEVER_CACHE = [
  '/api/',
  '/api/health',
  '/api/health-legacy',
  '/api/warmup',
  '/api/contact',
  '/api/projects'
];

// Maximum age for cached resources
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Function to clean up old cached resources
function cleanupOldCachedResources() {
  return caches.open(CACHE_NAME).then(cache => {
    return cache.keys().then(requests => {
      const now = Date.now();
      
      return Promise.all(
        requests.map(request => {
          // Get the cache entry metadata
          return cache.match(request).then(response => {
            if (!response) return;
            
            // Check the date header if it exists
            const dateHeader = response.headers.get('date');
            if (!dateHeader) return;
            
            const cacheDate = new Date(dateHeader).getTime();
            
            // If the cache entry is too old, remove it
            if (now - cacheDate > MAX_CACHE_AGE) {
              return cache.delete(request);
            }
          });
        })
      );
    });
  });
}

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

// Activate event - clean up old caches and claim clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean up old cache versions
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Clean up old cached resources within the current cache
      cleanupOldCachedResources(),
      
      // Claim any clients immediately
      self.clients.claim()
    ])
  );
  
  // Set up periodic cache cleanup
  if (self.registration.periodicSync) {
    try {
      self.registration.periodicSync.register('cache-cleanup', {
        minInterval: 24 * 60 * 60 * 1000 // Once per day
      });
    } catch (error) {
      console.error('Periodic Sync could not be registered:', error);
    }
  } else {
    // Fallback for browsers that don't support periodicSync
    setInterval(() => {
      console.log('Running scheduled cache cleanup');
      cleanupOldCachedResources();
    }, 24 * 60 * 60 * 1000); // Once per day
  }
});

// Listen for messages from clients
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data === 'INVALIDATE_CACHE' || (event.data && event.data.type === 'INVALIDATE_CACHE')) {
    // Clear all caches when requested
    console.log('Received request to invalidate cache');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log(`Deleting cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('All caches cleared successfully');
        // Notify the client if possible
        if (messagePort) {
          messagePort.postMessage({ type: 'CACHE_CLEARED' });
        }
      })
    );
  } else if (event.data && event.data.type === 'INIT_PORT') {
    // Store the port for later use
    const port = event.ports[0];
    
    // Send a message back to confirm the port is working
    port.postMessage({ type: 'PORT_READY' });
    
    // Store the port for later communication
    messagePort = port;
  }
});

// Helper function to determine if a request is a navigation request
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && 
          request.headers.get('accept').includes('text/html'));
}

// Helper to check if a request is for an API or should never be cached
function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// Helper to check if a URL should never be cached
function shouldNeverCache(url) {
  return NEVER_CACHE.some(pattern => {
    if (pattern.endsWith('/')) {
      // If pattern ends with '/', check if URL starts with this pattern
      return url.pathname.startsWith(pattern);
    }
    // Otherwise, check for exact match
    return url.pathname === pattern;
  });
}

// Helper function to detect serverless function errors in response
async function detectServerlessError(response) {
  // Clone the response to avoid consuming it
  const clonedResponse = response.clone();
  
  // Only check HTML responses
  const contentType = clonedResponse.headers.get('content-type');
  if (!contentType || !contentType.includes('text/html')) {
    return false;
  }
  
  try {
    const text = await clonedResponse.text();
    
    // Check for common serverless function error indicators
    const hasServerlessError = 
      text.includes('This Serverless Function has crashed') ||
      text.includes('FUNCTION_INVOCATION_FAILED') ||
      text.includes('INTERNAL_SERVER_ERROR') ||
      (text.includes('500') && text.includes('Internal Server Error'));
    
    if (hasServerlessError) {
      // Extract error code and ID if available
      let errorCode = 'FUNCTION_INVOCATION_FAILED';
      let errorId = '';
      
      const codeMatch = text.match(/Code:\s*["']?([\w_-]+)["']?/i);
      if (codeMatch && codeMatch[1]) {
        errorCode = codeMatch[1];
      }
      
      const idMatch = text.match(/ID:\s*["']?([\w:_\-]+)["']?/i);
      if (idMatch && idMatch[1]) {
        errorId = idMatch[1];
      }
      
      return {
        isError: true,
        code: errorCode,
        id: errorId
      };
    }
    
    return false;
  } catch (error) {
    console.error('Error checking for serverless errors:', error);
    return false;
  }
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
  
  // Skip API requests and URLs that should never be cached - let them go to the network
  if (isApiRequest(url) || shouldNeverCache(url)) {
    // For API requests, add error handling
    if (isApiRequest(url)) {
      event.respondWith(
        fetch(event.request)
          .then(async response => {
            // Check for serverless function errors
            const serverlessError = await detectServerlessError(response);
            if (serverlessError) {
              console.error('Serverless function error:', serverlessError);
              return caches.match('/fallback.html');
            }
            return response;
          })
          .catch(error => {
            console.error('API request failed:', error);
            // Return a JSON error response
            return new Response(JSON.stringify({
              error: 'Network Error',
              message: 'Failed to connect to the server. Please check your connection.'
            }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          })
      );
    }
    return;
  }
  
  // For navigation requests (HTML pages) - network-first strategy with improved error handling
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then(async response => {
          // Check for serverless function errors
          const serverlessError = await detectServerlessError(response);
          if (serverlessError) {
            console.error('Serverless function error:', serverlessError);
            // Try to get the custom serverless error page
            return caches.match('/serverless-error.html')
              .then(errorPage => {
                if (errorPage) {
                  return errorPage;
                } else {
                  // Fallback to the general fallback page if serverless error page is not available
                  return caches.match('/fallback.html');
                }
              });
          }
          
          // Check if the response is valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            throw new Error(`Invalid response: ${response ? response.status : 'no response'}`);
          }
          
          // Cache the latest version of the page
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(error => {
          console.log('Navigation request failed, falling back to cache:', error);
          
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                // Add a warning banner to cached responses
                return cachedResponse.text().then(text => {
                  // Only modify HTML responses
                  if (cachedResponse.headers.get('Content-Type')?.includes('text/html')) {
                    // Add a warning banner at the top of the body
                    const modifiedText = text.replace('<body>', `<body>
                      <div style="background-color: #fff3cd; color: #856404; padding: 10px; text-align: center; font-family: sans-serif; border-bottom: 1px solid #ffeeba;">
                        ⚠️ You're viewing a cached version of this page. <button onclick="location.reload(true)" style="background-color: #856404; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Refresh</button>
                      </div>`);
                    return new Response(modifiedText, {
                      headers: cachedResponse.headers,
                      status: cachedResponse.status,
                      statusText: cachedResponse.statusText
                    });
                  }
                  return new Response(text, cachedResponse);
                });
              }
              // If not in cache either, serve the fallback page
              console.log('No cached version available, serving fallback');
              return caches.match('/fallback.html').then(fallbackResponse => {
                if (fallbackResponse) {
                  return fallbackResponse;
                }
                // If fallback.html is not in cache, create a basic error response
                return new Response(
                  `<!DOCTYPE html>
                  <html>
                  <head>
                    <title>Offline - Connection Error</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                      body { font-family: sans-serif; padding: 20px; text-align: center; }
                      .error { color: #721c24; background-color: #f8d7da; padding: 20px; border-radius: 5px; }
                      button { background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
                    </style>
                  </head>
                  <body>
                    <div class="error">
                      <h1>Connection Error</h1>
                      <p>Unable to connect to the server. Please check your internet connection.</p>
                      <button onclick="location.reload(true)">Try Again</button>
                    </div>
                  </body>
                  </html>`,
                  {
                    status: 503,
                    headers: { 'Content-Type': 'text/html' }
                  }
                );
              });
            });
        })
    );
    return;
  }
  
  // For CSS and JS files - network-first for first load, then cache-first for subsequent loads
  if (event.request.url.match(/\.(css|js)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // For first load (no cached response), use network-first
          if (!cachedResponse) {
            return fetch(event.request)
              .then(networkResponse => {
                // Cache the response for future use
                if (networkResponse && networkResponse.status === 200) {
                  const responseToCache = networkResponse.clone();
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                  });
                }
                return networkResponse;
              })
              .catch(error => {
                console.error('First load fetch error for CSS/JS:', error);
                // Better fallback for first load of CSS/JS if network fails
                const isCSS = event.request.url.endsWith('.css');
                const contentType = isCSS ? 'text/css' : 'application/javascript';
                
                // Create a minimal fallback response based on resource type
                let fallbackContent = '';
                
                if (isCSS) {
                  // Minimal CSS fallback that hides non-essential elements and provides basic styling
                  fallbackContent = `
                    /* Emergency fallback CSS */
                    body { font-family: sans-serif; }
                    .error-message { display: block !important; color: #721c24; background-color: #f8d7da; padding: 10px; margin: 10px 0; border-radius: 4px; }
                    button { background-color: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
                    button:hover { background-color: #0069d9; }
                  `;
                } else {
                  // Minimal JS fallback that provides error notification
                  fallbackContent = `
                    /* Emergency fallback JS */
                    console.warn("Using emergency fallback JavaScript. Some features may not work.");
                    window.addEventListener('load', function() {
                      if (!window.resourceLoadError) {
                        window.resourceLoadError = true;
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message';
                        errorDiv.innerHTML = '<strong>Warning:</strong> Some resources failed to load. <button onclick="location.reload(true)">Reload</button>';
                        document.body.insertBefore(errorDiv, document.body.firstChild);
                      }
                    });
                  `;
                }
                
                return new Response(fallbackContent, {
                  status: 200, // Use 200 instead of 500 to prevent additional errors
                  headers: { 'Content-Type': contentType }
                });
              });
          }
          
          // For subsequent loads (cached response exists), use cache-first but update cache in background
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
              console.error('Subsequent fetch error for CSS/JS:', error);
              // We already have a cached response, so this error can be ignored
            });
          
          // Return cached response immediately for faster loading
          return cachedResponse;
        })
    );
    return;
  }
  
  // For other requests (images, etc.) - cache-first strategy with improved error handling
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          // Refresh cache in background for images and other static assets
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
            fetch(event.request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  const responseToCache = networkResponse.clone();
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                  });
                }
              })
              .catch(() => {
                // Ignore errors for background updates
              });
          }
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
            
            // For icon requests, return a default icon if available
            if (event.request.url.includes('favicon.ico') || event.request.url.includes('icon')) {
              return caches.match('/favicon.ico')
                .then(response => {
                  if (response) {
                    return response;
                  }
                  // If default icon is not available, create a tiny SVG icon
                  return new Response(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                      <rect width="32" height="32" fill="#4299e1" rx="4" ry="4"/>
                      <text x="16" y="22" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle" fill="white">H</text>
                    </svg>`,
                    {
                      status: 200,
                      headers: { 'Content-Type': 'image/svg+xml' }
                    }
                  );
                });
            }
            
            // For image requests, return a default image if available
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/profile-image.jpg')
                .then(response => {
                  if (response) {
                    return response;
                  }
                  // If default image is not available, create a tiny SVG placeholder
                  return new Response(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                      <rect width="200" height="200" fill="#f0f0f0"/>
                      <path d="M100,65 L130,110 L100,155 L70,110 Z" fill="#d0d0d0"/>
                      <circle cx="100" cy="85" r="15" fill="#d0d0d0"/>
                      <text x="100" y="180" font-family="Arial" font-size="14" text-anchor="middle" fill="#888">Image Unavailable</text>
                    </svg>`,
                    {
                      status: 200,
                      headers: { 'Content-Type': 'image/svg+xml' }
                    }
                  );
                });
            }
            
            // For font requests, return a system font fallback
            if (event.request.url.match(/\.(woff|woff2|ttf|eot)$/)) {
              // Return an empty response with appropriate headers
              return new Response('', {
                status: 200,
                headers: { 'Content-Type': 'application/font-woff' }
              });
            }
            
            // For other resources, return a generic error response
            return new Response('Resource unavailable', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
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

// Handle periodic sync events for cache cleanup
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupOldCachedResources());
  }
});

// Handle sync events (for offline functionality)
self.addEventListener('sync', event => {
  if (event.tag === 'retry-failed-requests') {
    // This would be implemented if we had offline form submissions or other actions
    // that need to be retried when connection is restored
    console.log('Retrying failed requests');
  }
});