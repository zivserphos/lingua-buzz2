import { LANGUAGE_SEO_DATA } from './languagesSeo';

// Types for SEO metadata
export interface SoundSEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  language: string;
  soundName: string;
  soundUrl: string;
  soundDuration?: number;
  category?: string;
  uploadDate?: string;
  hashtags?: string[];
}

/**
 * Generates SEO metadata for a sound based on language
 */
export function generateSoundSEO(
  language: string, 
  soundName: string, 
  soundUrl: string, 
  category?: string,
  duration?: number,
  hashtags?: string[]
): SoundSEOMetadata {
  // Normalize language code
  const normalizedLanguage = language.toLowerCase();
  // Get language data or fallback to English
  const languageData = LANGUAGE_SEO_DATA[normalizedLanguage] || LANGUAGE_SEO_DATA.english;
  
  // Get random terms for variety in SEO content
  const emotion = getRandomItem(languageData.emotions) as string;
  const trendTerm = getRandomItem(languageData.trendTerms) as string;
  const viralTerm = getRandomItem(languageData.viralTerms || []) as string;
  
  // Create title with language-specific pattern
  const title = `${soundName} - ${emotion} ${category || 'meme'} sound | Brainrot Memes`;
  
  // Create description with language-specific content
  const description = getLanguageSpecificDescription(
    normalizedLanguage, 
    soundName, 
    emotion, 
    category
  );
  
  // Generate language-specific keywords
  const keywords = [
    soundName,
    `${soundName} sound`,
    `${soundName} audio`,
    `${soundName} ${category || 'meme'}`,
    `${emotion} sound`,
    trendTerm,
    viralTerm,
    ...(hashtags || [])
  ].filter(Boolean) as string[];
  
  // Generate canonical URL
  const canonical = `https://brainrot-memes.com/${language}/memesound/${encodeURIComponent(soundName.toLowerCase().replace(/\s+/g, '_'))}`;
  
  // Generate OpenGraph image URL (assuming you have images for sounds)
  const ogImage = `https://brainrot-memes.com/og-images/${encodeURIComponent(soundName.toLowerCase().replace(/\s+/g, '_'))}.jpg`;
  
  return {
    title,
    description,
    keywords,
    ogImage,
    canonical,
    language,
    soundName,
    soundUrl,
    soundDuration: duration,
    category,
    uploadDate: new Date().toISOString().split('T')[0],
    hashtags
  };
}

/**
 * Generates language-specific descriptions
 */
function getLanguageSpecificDescription(
  language: string, 
  soundName: string, 
  emotion: string, 
  category?: string
): string {
  const descriptions = {
    english: `Listen to and download "${soundName}" - the ${emotion} ${category || 'meme'} sound that's trending right now. Perfect for TikTok, Instagram Reels, YouTube Shorts and other social media content.`,
    spanish: `Escucha y descarga "${soundName}" - el sonido de ${category || 'meme'} ${emotion} que está en tendencia ahora. Perfecto para TikTok, Instagram Reels, YouTube Shorts y otro contenido de redes sociales.`,
    portuguese: `Ouça e baixe "${soundName}" - o som ${emotion} de ${category || 'meme'} que está em alta agora. Perfeito para TikTok, Instagram Reels, YouTube Shorts e outro conteúdo de mídia social.`,
    german: `Höre und lade "${soundName}" herunter - den ${emotion} ${category || 'Meme'}-Sound, der gerade im Trend liegt. Perfekt für TikTok, Instagram Reels, YouTube Shorts und andere Social-Media-Inhalte.`,
    russian: `Слушайте и скачивайте "${soundName}" - ${emotion} звук ${category || 'мема'}, который сейчас в тренде. Идеально подходит для TikTok, Instagram Reels, YouTube Shorts и другого контента в социальных сетях.`,
    arabic: `استمع وقم بتنزيل "${soundName}" - صوت ${category || 'ميم'} ${emotion} الرائج الآن. مثالي لـ TikTok وInstagram Reels وYouTube Shorts ومحتوى وسائل التواصل الاجتماعي الأخرى.`,
    japanese: `今トレンドの${emotion}な${category || 'ミーム'}サウンド「${soundName}」を聴いてダウンロードしましょう。TikTok、Instagram Reels、YouTube Shortsなどのソーシャルメディアコンテンツに最適です。`,
    korean: `지금 인기 있는 ${emotion} ${category || '밈'} 사운드 "${soundName}"를 들어보고 다운로드하세요. TikTok, Instagram Reels, YouTube Shorts 및 기타 소셜 미디어 콘텐츠에 완벽합니다.`,
    vietnamese: `Nghe và tải xuống "${soundName}" - âm thanh ${category || 'meme'} ${emotion} đang thịnh hành ngay bây giờ. Hoàn hảo cho TikTok, Instagram Reels, YouTube Shorts và nội dung mạng xã hội khác.`,
    chinese: `收听并下载"${soundName}" - 目前流行的${emotion}${category || '模因'}声音。 适用于TikTok、Instagram Reels、YouTube Shorts和其他社交媒体内容。`,
    french: `Écoutez et téléchargez "${soundName}" - le son ${category || 'mème'} ${emotion} qui est tendance en ce moment. Parfait pour TikTok, Instagram Reels, YouTube Shorts et autres contenus de médias sociaux.`,
    italian: `Ascolta e scarica "${soundName}" - il suono ${emotion} da ${category || 'meme'} che sta andando di moda ora. Perfetto per TikTok, Instagram Reels, YouTube Shorts e altri contenuti sui social media.`,
    turkish: `"${soundName}" - şu anda trend olan ${emotion} ${category || 'meme'} sesini dinleyin ve indirin. TikTok, Instagram Reels, YouTube Shorts ve diğer sosyal medya içerikleri için mükemmel.`,
    hindi: `सुनें और डाउनलोड करें "${soundName}" - ${emotion} ${category || 'मीम'} साउंड जो अभी ट्रेंड कर रहा है। TikTok, Instagram Reels, YouTube Shorts और अन्य सोशल मीडिया कंटेंट के लिए एकदम सही।`,
    hebrew: `האזן והורד את "${soundName}" - צליל ה${category || 'מם'} ה${emotion} שנמצא בטרנד כרגע. מושלם ל-TikTok, Instagram Reels, YouTube Shorts ותוכן מדיה חברתית אחר.`
  };
  
  return descriptions[language] || descriptions.english;
}

/**
 * Generates JSON-LD structured data for audio content
 */
export function generateAudioStructuredData(seoData: SoundSEOMetadata): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    "name": seoData.soundName,
    "description": seoData.description,
    "contentUrl": seoData.soundUrl,
    "encodingFormat": "audio/mpeg",
    "duration": seoData.soundDuration ? `PT${Math.floor(seoData.soundDuration)}S` : undefined,
    "uploadDate": seoData.uploadDate,
    "inLanguage": seoData.language,
    "keywords": seoData.keywords.join(", ")
  };
  
  return JSON.stringify(structuredData);
}

/**
 * Gets a random item from an array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates alternate language links for the sound
 */
export function generateAlternateLanguageLinks(soundName: string): Record<string, string> {
  const encodedSoundName = encodeURIComponent(soundName.toLowerCase().replace(/\s+/g, '_'));
  const supportedLanguages = [
    'english', 'spanish', 'portuguese', 'german', 'russian', 'arabic', 
    'japanese', 'korean', 'vietnamese', 'chinese', 'french', 'italian', 
    'turkish', 'hindi', 'hebrew'
  ];
  
  return supportedLanguages.reduce((acc, lang) => {
    acc[lang] = `https://brainrot-memes.com/${lang}/memesound/${encodedSoundName}`;
    return acc;
  }, {} as Record<string, string>);
}
