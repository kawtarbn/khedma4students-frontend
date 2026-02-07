// Complete cache clearing utility
export const clearAllCache = () => {
  console.log('🧹 Clearing all cache and storage...');
  
  // Clear localStorage
  localStorage.clear();
  console.log('✅ localStorage cleared');
  
  // Clear sessionStorage
  sessionStorage.clear();
  console.log('✅ sessionStorage cleared');
  
  // Clear service worker cache
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
      console.log('✅ Service worker cache cleared');
    });
  }
  
  // Clear any application state
  if (window.location.pathname.includes('/dashboard') || 
      window.location.pathname.includes('/profile')) {
    console.log('🔄 Redirecting to clean login page...');
    window.location.href = '/login';
  }
  
  console.log('🎉 All cache cleared! Ready for fresh start.');
  
  return true;
};

// Auto-clear on page load if needed
export const autoClearCache = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const clearCache = urlParams.get('clearCache');
  
  if (clearCache === 'true') {
    clearAllCache();
    // Remove the parameter from URL
    const newUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, newUrl);
  }
};

// Export for manual use
window.clearAllCache = clearAllCache;
window.autoClearCache = autoClearCache;
