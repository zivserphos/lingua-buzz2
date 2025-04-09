export function createPageUrl(pageName, params = {}) {
  // Convert page name to lowercase
  let url = `/${pageName.toLowerCase()}`;
  
  // If there's a name parameter, add it as a path parameter (not a query parameter)
  if (params.name) {
    // Make sure to properly encode the parameter to handle special characters
    url += `/${encodeURIComponent(params.name)}`;
  }
  
  return url;
}

// Export all utilities as default export
const utils = {
  createPageUrl
};

export default utils;