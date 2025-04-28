import { SitemapStream } from 'sitemap';
import { createWriteStream } from 'fs';
import { writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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
        if (route.startsWith('/privacy-') || 
            route.startsWith('/terms-') || 
            route.startsWith('/disclaimer') || 
            route.startsWith('/community-')) {
          return;
        }

        smStream.write({
          url: `/${language}${route}`,
          changefreq: 'weekly',
          priority: 0.7
        });
      });
    });

    // End the stream
    smStream.end();
    
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();


    // If you have blog posts or other dynamic content, you could fetch and add them here
    // For example:
    // const blogPosts = await fetchBlogPosts();
    // blogPosts.forEach(post => {
    //   SUPPORTED_LANGUAGES.forEach(language => {
    //     smStream.write({
    //       url: `/${language}/blog/${post.slug}`,
    //       changefreq: 'weekly',
    //       priority: 0.6,
    //       lastmod: post.lastModified
    //     });
    //   });
    // });
