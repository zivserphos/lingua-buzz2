/**
 * Generates a smaller version URL for images
 * @param {string} originalUrl - Original image URL
 * @returns {string} URL for small image version
 */
export function generateSmallImageUrl(originalUrl) {
  if (!originalUrl) return '';
  
  // If using Firebase Storage
  if (originalUrl.includes('firebasestorage.googleapis.com')) {
    // Add Firebase image resize parameter
    return originalUrl.replace('alt=media', 'alt=media&w=400');
  }
  
  // For Cloudinary URLs
  if (originalUrl.includes('cloudinary.com')) {
    return originalUrl.replace('/upload/', '/upload/w_400/');
  }
  
  return originalUrl; // Fallback to original if can't be transformed
}

/**
 * Generates a medium-sized version URL for images
 * @param {string} originalUrl - Original image URL
 * @returns {string} URL for medium image version
 */
export function generateMediumImageUrl(originalUrl) {
  if (!originalUrl) return '';
  
  if (originalUrl.includes('firebasestorage.googleapis.com')) {
    return originalUrl.replace('alt=media', 'alt=media&w=800');
  }
  
  // For Cloudinary URLs
  if (originalUrl.includes('cloudinary.com')) {
    return originalUrl.replace('/upload/', '/upload/w_800/');
  }
  
  return originalUrl;
}
