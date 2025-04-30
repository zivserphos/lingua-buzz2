import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/pages';

export default function SEO({
  title,
  description = 'Discover and share viral meme sounds, audio clips and soundboard effects.',
  currentLanguage = DEFAULT_LANGUAGE.toLowerCase(),
  slug = null,
  type = 'website',
  soundId = null,
  image = null, // Added image prop for social media sharing
}) {
  const location = useLocation();
  const pageUrl = `https://brainrot-memes.com${location.pathname}`;
  const baseUrl = 'https://brainrot-memes.com';
  const defaultImage = `${baseUrl}/default-social-image.jpg`; // Default image for social sharing

  // Determine if this is a language-specific page
  const pathParts = location.pathname.split('/').filter(Boolean);
  const isLanguagePage = 
    pathParts.length > 0 && 
    SUPPORTED_LANGUAGES.some(lang => 
      lang.code.toLowerCase() === pathParts[0].toLowerCase()
    ) &&
    !location.pathname.startsWith('/blog') &&
    !location.pathname.startsWith('/privacy') &&
    !location.pathname.startsWith('/terms') &&
    !location.pathname.startsWith('/disclaimer') &&
    !location.pathname.startsWith('/community');

  // Calculate canonical URL (non-language pages are already canonical)
  const canonicalUrl =
    isLanguagePage &&
    currentLanguage.toLowerCase() !== DEFAULT_LANGUAGE.toLowerCase()
      ? `${baseUrl}/${DEFAULT_LANGUAGE.toLowerCase()}${location.pathname.substring(
          location.pathname.indexOf('/', 1)
        )}`
      : pageUrl;

  // Get path suffix for hreflang alternates
  let pathSuffix = '';
  if (isLanguagePage) {
    const parts = location.pathname.split('/');
    // Remove language part and combine the rest
    pathSuffix = '/' + parts.slice(2).join('/');
  }

  // Format publish date for structured data
  const getFormattedDate = () => {
    // Use current date as default
    return new Date().toISOString();
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title} | Brainrot Memes</title>
      <meta name='description' content={description} />

      {/* Canonical URL - critical for fixing the "alternative page" issue */}
      <link rel='canonical' href={canonicalUrl} />

      {/* OpenGraph Tags */}
      <meta property='og:title' content={`${title} | Brainrot Memes`} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={pageUrl} />
      <meta property='og:type' content={type} />
      <meta property='og:image' content={image || defaultImage} />
      <meta property='og:image:width' content="1200" />
      <meta property='og:image:height' content="630" />

      {/* Twitter Tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={`${title} | Brainrot Memes`} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image || defaultImage} />

      {/* hreflang annotations - crucial for language variants */}
      {isLanguagePage &&
        SUPPORTED_LANGUAGES.map((lang) => (
          <link
            key={lang.code}
            rel='alternate'
            hreflang={lang.code.substring(0, 2).toLowerCase()}
            href={`${baseUrl}/${lang.code.toLowerCase()}${pathSuffix}`}
          />
        ))}

      {/* x-default hreflang pointing to default language version */}
      {isLanguagePage && (
        <link
          rel='alternate'
          hreflang='x-default'
          href={`${baseUrl}/${DEFAULT_LANGUAGE.toLowerCase()}${pathSuffix}`}
        />
      )}

      {/* Add Schema.org structured data for better indexing */}
      {soundId && (
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AudioObject',
            name: title,
            description: description,
            url: pageUrl,
            contentUrl: `https://brainrot-memes.com/api/sounds/${soundId}/audio`,
            encodingFormat: 'audio/mpeg',
            datePublished: getFormattedDate(),
          })}
        </script>
      )}

      {slug && (
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description: description,
            image: image || defaultImage,
            url: pageUrl,
            datePublished: getFormattedDate(),
            author: {
              '@type': 'Organization',
              name: 'Brainrot Memes',
              url: baseUrl
            },
            publisher: {
              '@type': 'Organization',
              name: 'Brainrot Memes',
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': pageUrl
            }
          })}
        </script>
      )}
    </Helmet>
  );
}
