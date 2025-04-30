import React from "react";
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../components/footer/Footer";
import SEO from "@/components/seo/Seo";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './index';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const params = useParams();
  
  // Extract language from URL
  const pathParts = location.pathname.split('/');
  const currentLanguage = pathParts[1] || DEFAULT_LANGUAGE;
  
  // Get sound_id if present
  const soundId = params.sound_id || null;
  
  // Get blog slug if present
  const slug = params.slug || null;
  
  // Determine if this is a language-specific page
  const isLanguagePage = location.pathname.split('/')[1]?.toLowerCase() !== 'blog' && 
                         !location.pathname.startsWith('/privacy') &&
                         !location.pathname.startsWith('/terms') &&
                         !location.pathname.startsWith('/disclaimer') &&
                         !location.pathname.startsWith('/community');
  
  // Determine page description based on the current page
  const getPageDescription = () => {
    switch(currentPageName) {
      case 'Sounds':
        return `Explore viral ${currentLanguage} meme sounds like tralalero tralala, bombardiro crocodilo, and more.`;
      case 'Leaderboard':
        return `Top trending ${currentLanguage} meme sounds ranked by popularity.`;
      case 'SavedSounds':
        return 'Your collection of saved meme sounds and audio clips.';
      case 'MemeSound':
        return params.sound_id 
          ? `Listen to the viral "${params.sound_id.replace(/_/g, ' ')}" meme sound in ${currentLanguage}.`
          : 'Discover popular meme sounds and audio clips.';
      case 'Blog':
        return slug 
          ? `Read our article about ${slug.replace(/-/g, ' ')} and meme sounds.`
          : 'Articles about meme sounds, viral audio, and internet sound culture.';
      default:
        return 'Discover and share viral meme sounds, audio clips and soundboard effects.';
    }
  };
  
  // Create structured data based on page type
  const generateStructuredData = () => {
    const baseUrl = "https://brainrot-memes.com";
    const pageUrl = `${baseUrl}${location.pathname}`;
    
    if (currentPageName === 'MemeSound' && soundId) {
      return {
        "@context": "https://schema.org",
        "@type": "AudioObject",
        "name": `${soundId.replace(/_/g, ' ')} meme sound`,
        "description": getPageDescription(),
        "url": pageUrl,
        "contentUrl": `${baseUrl}/api/sounds/${soundId}/audio`,
        "encodingFormat": "audio/mpeg",
        "potentialAction": {
          "@type": "ListenAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": pageUrl
          }
        }
      };
    }
    
    if (['Sounds', 'Leaderboard', 'SavedSounds'].includes(currentPageName)) {
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${currentPageName} | Brainrot Memes`,
        "description": getPageDescription(),
        "url": pageUrl
      };
    }
    
    // Default WebPage structured data
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `${currentPageName} | Brainrot Memes`,
      "description": getPageDescription(),
      "url": pageUrl
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={currentPageName} 
        description={getPageDescription()}
        currentLanguage={currentLanguage}
        soundId={soundId}
        slug={slug}
        structuredData={generateStructuredData()}
        isLanguagePage={isLanguagePage}
        pathSuffix={isLanguagePage ? location.pathname.substring(location.pathname.indexOf('/', 1)) : ''}
      />
      
      <div className="flex-grow">
        {children}
      </div>
      
      <Footer />
    </div>
  );
}
