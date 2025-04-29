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

// Define your routes (excluding dynamic routes that need parameters)
const STATIC_ROUTES = [
  '/sounds',
  '/leaderboard',
  '/savedsounds',
  '/memesound',
  '/blog',
  '/privacy-policy',
  '/terms-of-use',
  '/disclaimer',
  '/community-guidelines'
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

    // Add policy pages (non-language specific)
    smStream.write({ url: '/privacy-policy', changefreq: 'monthly', priority: 0.3 });
    smStream.write({ url: '/terms-of-use', changefreq: 'monthly', priority: 0.3 });
    smStream.write({ url: '/disclaimer', changefreq: 'monthly', priority: 0.3 });
    smStream.write({ url: '/community-guidelines', changefreq: 'monthly', priority: 0.3 });
    
    // Add blog routes (non-language specific)
    smStream.write({ url: '/blog', changefreq: 'weekly', priority: 0.8 });
    
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

      // Each static route with language prefix
      STATIC_ROUTES.forEach(route => {
        // Skip policy pages since we already added them
        // Also skip blog routes since they're now non-language specific
        if (route.startsWith('/privacy-') || 
            route.startsWith('/terms-') || 
            route.startsWith('/disclaimer') || 
            route.startsWith('/community-') ||
            route.startsWith('/blog')) {
          return;
        }

        smStream.write({
          url: `/${language}${route}`,
          changefreq: 'weekly',
          priority: 0.7
        });
      });

      // Add language-specific memesound pages with sound IDs for popular sounds
      // This helps search engines discover your most important sound pages
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
    
    // You can also add a timestamp to track when the sitemap was last generated
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
