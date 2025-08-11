// Preload critical assets to improve initial loading experience
(function() {
  // List of critical assets to preload
  const criticalAssets = [
    '/static/css/main.css', // Will match any hashed version
    '/static/js/main.js',   // Will match any hashed version
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

  // Add inline styles to prevent FOUC (Flash of Unstyled Content)
  const inlineStyles = document.createElement('style');
  inlineStyles.textContent = `
    /* Critical styles to prevent layout shift */
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      background-color: #f8f9fa;
    }
    #root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .loading {
      opacity: 0;
      transition: opacity 0.3s ease-in;
    }
    .loaded {
      opacity: 1;
    }
  `;
  
  // Add the inline styles to the head
  const head = document.head || document.getElementsByTagName('head')[0];
  head.appendChild(inlineStyles);

  // Also try to warm up the connection to the backend API
  function warmUpApiConnection() {
    const warmupRequest = new XMLHttpRequest();
    warmupRequest.open('GET', '/api/projects', true);
    warmupRequest.send();
  }

  // Warm up connection after a short delay
  setTimeout(warmUpApiConnection, 1000);

  // Add a class to the body when all resources are loaded
  window.addEventListener('load', function() {
    document.getElementById('root').classList.add('loaded');
  });
})();