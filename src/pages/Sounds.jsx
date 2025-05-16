import React, { useRef, useCallback, useState, useMemo } from 'react'; // Add useMemo
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async'; // Add Helmet import

// Ads components
import BottomFixedAd from '@/components/ads/BottomFixedAd';
import LeftSideAd from '@/components/ads/LeftSideAd';
import RightSideAd from '@/components/ads/RightSideAd';

// Auth components
import AuthBanner from '@/components/auth/AuthBanner';
import GuestDialog from '@/components/auth/GuestDialog';

// Sound components
import Header from '@/components/sounds/Header';
import SearchControls from '@/components/sounds/SearchControls';
import SoundGrid from '@/components/sounds/SoundGrid';
import ErrorMessage from '@/components/sounds/ErrorMessage';


// Custom hooks
import useAuth from '@/hooks/useAuth';
import useSoundsData from '@/hooks/useSoundsData';
import useAdSense from '@/hooks/useAdSense';


// SEO utilities
import { LANGUAGE_SEO_DATA } from '@/utils/languagesSeo';

export default function SoundsPage() {
  const loadingIndicatorRef = useRef(null);
  const [interactionSource, setInteractionSource] = useState(null);

  // Initialize ad loading
  useAdSense();

  // Authentication state and methods
  const {
    user,
    idToken,
    authLoading,
    isAnonymousGuest,
    showAuthBanner,
    showGuestDialog,
    guestUsername,
    handleGoogleSignIn,
    handleGuestDialogOpen,
    handleGuestSignIn,
    handleSignOut,
    setShowAuthBanner,
    setShowGuestDialog,
    setGuestUsername,
  } = useAuth();

  // Sounds data and methods
  const {
    sounds,
    loading,
    initialLoading,
    language,
    searchTerm,
    error,
    totalItems,
    fetchSounds,
    handleSearchInput,
    handleLanguageChange,
    handleExplicitSearch,
    hasNextPage,
    currentPage,
  } = useSoundsData(idToken);

  // Generate SEO metadata based on current language
  const seoData = useMemo(() => {
    const normalizedLanguage = language.toLowerCase();
    const languageData = LANGUAGE_SEO_DATA[normalizedLanguage] || LANGUAGE_SEO_DATA.english;
    
    // Get random terms for variety in SEO content
    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
    const emotion = getRandomItem(languageData.emotions || []);
    const trendTerm = getRandomItem(languageData.trendTerms || []);
    
    // Set titles and descriptions based on language
    const titles = {
      english: `Sounds | Brainrot Memes Funny Meme Sounds & Audio Effects | Download Free ${searchTerm ? `${searchTerm} ` : ''}Sound Effects`,
      spanish: `Sonidos Graciosos de Memes y Efectos de Audio | Descarga ${searchTerm ? `${searchTerm} ` : ''}Gratis`,
      portuguese: `Sons Engraçados de Memes e Efeitos de Áudio | Baixe ${searchTerm ? `${searchTerm} ` : ''}Grátis`,
      german: `Lustige Meme-Sounds & Audio-Effekte | Kostenlose ${searchTerm ? `${searchTerm} ` : ''}Soundeffekte`,
      russian: `Смешные Звуки Мемов и Аудио Эффекты | Скачать ${searchTerm ? `${searchTerm} ` : ''}Бесплатно`,
      arabic: `أصوات ميمز مضحكة وتأثيرات صوتية | تنزيل ${searchTerm ? `${searchTerm} ` : ''}مجاناً`,
      japanese: `おもしろミーム音とオーディオ効果 | 無料${searchTerm ? `${searchTerm} ` : ''}サウンドをダウンロード`,
      korean: `재미있는 밈 소리 및 오디오 효과 | 무료 ${searchTerm ? `${searchTerm} ` : ''}사운드 다운로드`,
      vietnamese: `Âm Thanh Meme Hài Hước & Hiệu Ứng Âm Thanh | Tải ${searchTerm ? `${searchTerm} ` : ''}Miễn Phí`,
      chinese: `搞笑模因声音和音频效果 | 免费下载${searchTerm ? `${searchTerm} ` : ''}音效`,
      french: `Sons de Mèmes Drôles et Effets Audio | Téléchargez ${searchTerm ? `${searchTerm} ` : ''}Gratuitement`,
      italian: `Suoni Divertenti di Meme ed Effetti Audio | Scarica ${searchTerm ? `${searchTerm} ` : ''}Gratis`,
      turkish: `Komik Meme Sesleri ve Ses Efektleri | Ücretsiz ${searchTerm ? `${searchTerm} ` : ''}İndirin`,
      hindi: `मजेदार मीम साउंड और ऑडियो इफेक्ट्स | मुफ्त ${searchTerm ? `${searchTerm} ` : ''}डाउनलोड करें`,
      hebrew: `הקלטות מצחיקות ומוכרות שכל ישראלי מכיר , מתאים לערב מצוין עם החבר׳ה , סתלבט ללא גבולות רק לצחוק , כל הסאונדים הכי מטומטמים מרוכזים במקום אחד , מרכז הסתלבט הישראלי ,`

    };
    
    const descriptions = {
      english: `Browse and download ${emotion} meme sounds, audio effects and clips. Perfect for TikTok, Reels, and YouTube Shorts. Create viral content with our ${trendTerm} sound collection.`,
      spanish: `Explora y descarga sonidos ${emotion} de memes, efectos de audio y clips. Perfectos para TikTok, Reels y YouTube Shorts. Crea contenido viral con nuestra colección de sonidos ${trendTerm}.`,
      portuguese: `Navegue e baixe sons ${emotion} de memes, efeitos de áudio e clipes. Perfeitos para TikTok, Reels e YouTube Shorts. Crie conteúdo viral com nossa coleção de sons ${trendTerm}.`,
      // Add other languages similarly...
    };
    
    // Get description for current language or fallback to English
    const description = descriptions[normalizedLanguage] || descriptions.english;
    const title = titles[normalizedLanguage] || titles.english;
    
    return {
      title,
      description,
      canonical: `https://brainrot-memes.com/${language}/sounds${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ''}`,
      language
    };
  }, [language, searchTerm]);

  // Generate structured data for sounds collection
  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": seoData.title,
      "description": seoData.description,
      "url": seoData.canonical,
      "inLanguage": language === 'english' ? 'en' : language.substring(0, 2),
      "numberOfItems": totalItems,
      "itemListElement": sounds.slice(0, 10).map((sound, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "AudioObject",
          "name": sound.name,
          "contentUrl": sound.audioUrl,
          "encodingFormat": "audio/mpeg"
        }
      }))
    });
  }, [sounds, totalItems, seoData, language]);

  // NEW: Add callback for loading more items
  const handleLoadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      console.log(`Loading more sounds (page ${currentPage})`);
      fetchSounds({ reset: false }); // Load more items without resetting
    }
  }, [fetchSounds, loading, hasNextPage, currentPage]);

  const handleSocialInteraction = (interactionType) => {
    setInteractionSource(interactionType);
    handleGuestDialogOpen();
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'>
      {/* Add Helmet for SEO */}
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <link rel="canonical" href={seoData.canonical} />
        <html lang={language === 'english' ? 'en' : language.substring(0, 2)} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:image" content="https://brainrot-memes.com/og-images/sounds-collection.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content="https://brainrot-memes.com/og-images/sounds-collection.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">{structuredData}</script>
      </Helmet>

      {/* <BottomFixedAd /> */}

      <div className='max-w-[1600px] mx-auto px-4 py-8'>
        {/* Authentication banner */}
        <AuthBanner
          id='auth-banner'
          show={showAuthBanner}
          onGuestClick={() => setShowAuthBanner(false)}
          onSignInClick={() => {
            /* Navigate to sign in */
          }}
          onClose={() => setShowAuthBanner(false)}
        />

        {/* Rest of the components remain unchanged */}
        <Header
          user={user}
          isAnonymousGuest={isAnonymousGuest}
          authLoading={authLoading}
          onGuestClick={handleGuestDialogOpen}
          onSignInClick={handleGoogleSignIn}
          onSignOutClick={handleSignOut}
        />

        <SearchControls
          searchTerm={searchTerm}
          language={language}
          onSearchChange={handleSearchInput}
          onLanguageChange={handleLanguageChange}
          onSearch={handleExplicitSearch}
        />

        {error && (
          <ErrorMessage
            error={error}
            onRetry={() => fetchSounds({ reset: true })}
          />
        )}

        {initialLoading ? (
          <div className='flex flex-col justify-center items-center min-h-[300px]'>
            <Loader2 className='w-10 h-10 animate-spin text-purple-600 mb-4' />
            <p className='text-sm text-gray-500 mb-2'>Loading sounds...</p>
            <Button
              onClick={() => {
                fetchSounds({ reset: true });
              }}
              variant='outline'
              size='sm'
              className='mt-4'
            >
              Reset Loading
            </Button>
          </div>
        ) : (
          <div className='flex'>
            <div
              className='hidden xl:block fixed left-0 top-1/2 transform -translate-y-1/2 ml-4'
              style={{ width: '160px', zIndex: 40 }}
            >
              <LeftSideAd />
            </div>

            <SoundGrid
              sounds={sounds}
              loading={loading}
              totalItems={totalItems}
              hasNextPage={hasNextPage}
              isAnonymousGuest={isAnonymousGuest}
              loadingIndicatorRef={loadingIndicatorRef}
              onShowAuthBanner={() => setShowAuthBanner(true)}
              onShowGuestDialog={handleSocialInteraction}
              initialLoading={initialLoading}
              onLoadMore={handleLoadMore}
              language={language}
            />

            <div
              className='hidden xl:block fixed right-0 top-1/2 transform -translate-y-1/2 mr-4'
              style={{ width: '160px', zIndex: 40 }}
            >
              <RightSideAd />
            </div>
          </div>
        )}
      </div>

      <GuestDialog
        open={showGuestDialog}
        isAnonymousGuest={isAnonymousGuest}
        username={guestUsername}
        onOpenChange={setShowGuestDialog}
        onUsernameChange={(e) => setGuestUsername(e.target.value)}
        onSubmit={handleGuestSignIn}
        interactionSource={interactionSource}
        onGoogleSignIn={handleGoogleSignIn}
      />

      <style>{`
        .ad-container {
          min-height: 250px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .left-side-ad,
        .right-side-ad {
          min-width: 160px;
          min-height: 600px;
        }

        .bottom-fixed-ad {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          min-height: 90px;
          background: white;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .left-side-ad,
          .right-side-ad {
            min-height: 250px;
          }
        }
      `}</style>
    </div>
  );
}
