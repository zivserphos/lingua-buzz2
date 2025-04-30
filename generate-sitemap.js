import { SitemapStream } from 'sitemap';
import { createWriteStream } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from './src/components/blog/blogposts.js';

// Get current directory equivalent to __dirname in CommonJS
const __dirname = dirname(fileURLToPath(import.meta.url));

// Your website's base URL
const BASE_URL = 'https://brainrot-memes.com';

// Get supported languages from your app
const SUPPORTED_LANGUAGES = [
  "English", "Portuguese", "Spanish", "German", "Russian", 
  "Arabic", "Japanese", "Korean", "Vietnamese", "Chinese", 
  "French", "Italian", "Turkish", "Hindi", "Hebrew"
].map(lang => lang.toLowerCase());

// Define direct routes (no language prefix)
const DIRECT_ROUTES = [
  '/leaderboard',
  '/savedsounds',
  '/blog',
  '/privacy-policy',
  '/terms-of-use',
  '/disclaimer',
  '/community-guidelines'
];

// Define language-specific routes
const LANGUAGE_ROUTES = [
  '/sounds',
  '/memesound'
];

async function generateSitemap() {
  try {
    // Create a sitemap stream
    const smStream = new SitemapStream({ hostname: BASE_URL });
    const writeStream = createWriteStream(join(__dirname, 'public', 'sitemap.xml'));
    smStream.pipe(writeStream);

    // Add root URL with default language
    smStream.write({ 
      url: '/', 
      changefreq: 'daily', 
      priority: 1.0 
    });

    // Add direct routes (non-language specific)
    DIRECT_ROUTES.forEach(route => {
      // For policy pages
      if (route.startsWith('/privacy-') || 
          route.startsWith('/terms-') || 
          route.startsWith('/disclaimer') || 
          route.startsWith('/community-')) {
        smStream.write({ url: route, changefreq: 'monthly', priority: 0.3 });
      }
      // For leaderboard and savedsounds
      else if (route === '/leaderboard' || route === '/savedsounds') {
        smStream.write({ url: route, changefreq: 'daily', priority: 0.7 });
      }
      // For blog
      else if (route === '/blog') {
        smStream.write({ url: route, changefreq: 'weekly', priority: 0.8 });
      }
    });
    
    // Add individual blog posts
    blogPosts.forEach(post => {
      smStream.write({
        url: `/blog/${post.slug}`,
        changefreq: 'monthly',
        priority: 0.7
      });
    });

    // Add language-specific routes
    SUPPORTED_LANGUAGES.forEach(language => {
      // Root language route
      smStream.write({
        url: `/${language}`,
        changefreq: 'daily',
        priority: 0.9
      });

      // Each language-specific route
      LANGUAGE_ROUTES.forEach(route => {
        smStream.write({
          url: `/${language}${route}`,
          changefreq: 'weekly',
          priority: 0.7
        });
      });

      // Add language-specific memesound pages with sound IDs for popular sounds
      const popularSoundIds = ['eatin_the_dogs', 'yes_yes_skibidi_yes', 'tralalero_tralala'];
      popularSoundIds.forEach(soundId => {
        smStream.write({
          url: `/${language}/memesound/${soundId}`,
          changefreq: 'monthly',
          priority: 0.6
        });
      });
    });

    // Close the stream and finalize the sitemap
    smStream.end();
    
    console.log('Sitemap generated successfully!');
    console.log(`Generated at: ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1); // Exit with error code
  }
}

// Execute the function
generateSitemap().then(() => {
  console.log('Sitemap generation complete');
}).catch(err => {
  console.error('Failed to generate sitemap:', err);
});
