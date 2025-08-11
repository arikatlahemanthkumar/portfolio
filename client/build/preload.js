// Preload critical assets to improve initial loading experience
(function() {
  // List of critical assets to preload
  const criticalAssets = [
    '/static/css/main.3eb1688e.css',
    '/static/js/main.c2671409.js',
    '/profile-image.jpg',
    '/favicon.ico'
  ];

  // Function to preload assets
  function preloadAssets() {
    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset;
      
      // Set appropriate as attribute based on file type
      if (asset.endsWith('.css')) {
        link.as = 'style';
      } else if (asset.endsWith('.js')) {
        link.as = 'script';
      } else if (asset.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        link.as = 'image';
      }
      
      document.head.appendChild(link);
    });
  }

  // Execute preloading as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadAssets);
  } else {
    preloadAssets();
  }

  // Also try to warm up the connection to the backend API
  function warmUpApiConnection() {
    const warmupRequest = new XMLHttpRequest();
    warmupRequest.open('GET', '/api/projects', true);
    warmupRequest.send();
  }

  // Warm up connection after a short delay
  setTimeout(warmUpApiConnection, 1000);
})();