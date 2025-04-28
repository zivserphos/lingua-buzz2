export function createPageUrl(pageName, params = {}) {
  // Get current language from localStorage or use default
  const language = (localStorage.getItem('selected_language') || 'English').toLowerCase();
  
  // Start with language prefix
  let url = `/${language}`;
  
  // Add the page name (if it's not the default page)
  if (pageName && pageName.toLowerCase() !== 'sounds') {
    url += `/${pageName.toLowerCase()}`;
  }
  
  // Add URL parameters if provided
  if (params.sound_id) {
    url += `/${encodeURIComponent(params.sound_id)}`;
  } else if (params.slug) {
    url += `/${encodeURIComponent(params.slug)}`;
  }
  
  return url;
}

// Export all utilities as default export
const utils = {
  createPageUrl
};

export default utils;
