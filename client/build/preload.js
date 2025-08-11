// Preload critical assets to improve initial loading experience
(function() {
  // List of critical assets to preload
  const criticalAssets = [
    // Use regex to find the actual hashed filenames in the document
    // This is more reliable than hardcoded paths
  ];

  // Function to find and preload CSS and JS assets with their actual hashed names
  function findAndPreloadAssets() {
    // Find all link and script tags
    const linkTags = document.querySelectorAll('link[href]');
    const scriptTags = document.querySelectorAll('script[src]');
    
    // Extract and preload CSS files
    linkTags.forEach(link => {
      if (link.href && link.href.includes('/static/css/')) {
        preloadResource(link.href, 'style');
      }
    });
    
    // Extract and preload JS files
    scriptTags.forEach(script => {
      if (script.src && script.src.includes('/static/js/')) {
        preloadResource(script.src, 'script');
      }
    });
    
    // Also preload important images
    preloadResource('/profile-image.jpg', 'image');
    preloadResource('/favicon.ico', 'image');
  }
  
  // Helper function to preload a resource
  function preloadResource(url, as) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  // Execute preloading as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', findAndPreloadAssets);
  } else {
    findAndPreloadAssets();
  }
  
  // Add a retry mechanism for failed resource loads
  function addRetryMechanism() {
    window.addEventListener('error', function(event) {
      const target = event.target;
      
      // Only handle resource loading errors
      if (target.tagName === 'LINK' || target.tagName === 'SCRIPT' || target.tagName === 'IMG') {
        const url = target.src || target.href;
        
        // Skip if no URL or already retried
        if (!url || target.dataset.retried) return;
        
        console.log('Resource failed to load, retrying:', url);
        
        // Mark as retried to prevent infinite loops
        target.dataset.retried = 'true';
        
        // Create a new element to replace the failed one
        const newElement = target.cloneNode(true);
        
        // Add cache-busting parameter
        const cacheBuster = '?retry=' + Date.now();
        if (newElement.src) {
          newElement.src = url.includes('?') ? url + '&retry=' + Date.now() : url + cacheBuster;
        } else if (newElement.href) {
          newElement.href = url.includes('?') ? url + '&retry=' + Date.now() : url + cacheBuster;
        }
        
        // Replace the failed element
        if (target.parentNode) {
          target.parentNode.replaceChild(newElement, target);
        }
      }
    }, true); // Use capture to get the event before it reaches the target
  }
  
  // Add retry mechanism
  addRetryMechanism();

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

  // Improved function to warm up the connection to the backend API with retry logic
  function warmUpApiConnection() {
    console.log('Warming up API connection...');
    
    // Use fetch with timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    fetch('/api/projects', {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'x-warmup-request': 'true' // Custom header to identify warmup requests
      }
    })
    .then(response => {
      clearTimeout(timeoutId);
      console.log('API connection successful:', response.status);
      // Don't need to process the response, just warming up the connection
    })
    .catch(error => {
      clearTimeout(timeoutId);
      console.log('API warmup failed, retrying in 2s:', error.message);
      // Retry once after 2 seconds
      setTimeout(warmUpApiConnection, 2000);
    });
  }

  // Warm up connection after a short delay to allow the page to load first
  setTimeout(warmUpApiConnection, 1500);

  // Add a class to the body when all resources are loaded
  window.addEventListener('load', function() {
    document.getElementById('root').classList.add('loaded');
    
    // Hide the initial loader
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader) {
      initialLoader.style.opacity = '0';
      setTimeout(() => {
        initialLoader.style.display = 'none';
      }, 300);
    }
  });
  
  // Handle serverless function errors
  function handleServerlessFunctionErrors() {
    // Check if we're on Vercel by looking for specific error messages
    const checkForVercelErrors = () => {
      // Look for error elements that might indicate a serverless function error
      const errorElements = document.querySelectorAll('h1, div, p');
      let foundServerlessError = false;
      
      errorElements.forEach(el => {
        const text = el.textContent || '';
        if (
          text.includes('Serverless Function') && text.includes('crashed') ||
          text.includes('FUNCTION_INVOCATION_FAILED') ||
          text.includes('500') && text.includes('INTERNAL_SERVER_ERROR')
        ) {
          foundServerlessError = true;
        }
      });
      
      if (foundServerlessError) {
        console.log('Detected serverless function error, reloading page...');
        // Add a small delay before reloading to avoid immediate reload loops
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };
    
    // Check shortly after page load
    setTimeout(checkForVercelErrors, 2000);
  }
  
  // Call the function to handle serverless errors
  handleServerlessFunctionErrors();
})();