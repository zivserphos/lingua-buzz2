/**
 * LanguagesSEO - Comprehensive multilingual SEO optimization utility
 * Maximizes search visibility across 15 languages with regional keyword targeting
 */

// Sound content types for different description templates
export type SoundContentType = 'meme' | 'viral' | 'trend' | 'reaction' | 'background' | 'effect';

// Sound characteristics that influence keyword selection
export interface SoundSEOMetadata {
  id: string;
  name: string;
  length?: number;
  viralityIndex?: number;
  hashtags?: string[];
  contentType?: SoundContentType;
  year?: string;
  isFunny?: boolean;
}

// Language-specific constants including regional keywords and cultural references
export const LANGUAGE_SEO_DATA = {
  english: {
    locale: 'en_US',
    countryCode: 'US',
    regionNames: ['American', 'British', 'Australian', 'Canadian'],
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Snapchat', 'Facebook'],
    viralTerms: ['trending', 'viral', 'meme', 'soundbite', 'earworm', 'popular sound'],
    culturalReferences: ['Discord call', 'stream highlights', 'reaction sound', 'twitch', 'streamer'],
    emotions: ['funny', 'hilarious', 'amusing', 'entertaining', 'addictive'],
    userActions: ['play', 'download', 'share', 'favorite', 'loop'],
    audienceTerms: ['Gen Z', 'Millennial', 'gamer', 'meme enthusiast', 'internet culture'],
    trendTerms: ['brainrot', 'skibidi', 'sigma', 'rizz', 'yapping']
  },
  spanish: {
    locale: 'es_ES',
    countryCode: 'ES',
    regionNames: ['Español', 'Latino', 'Mexicano', 'Colombiano', 'Argentino'],
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Kwai'],
    viralTerms: ['viral', 'tendencia', 'meme sonoro', 'audio popular', 'sonido de moda'],
    culturalReferences: ['stream', 'meme español', 'humor latino', 'risa viral', 'sonido gracioso'],
    emotions: ['gracioso', 'divertido', 'chistoso', 'risas aseguradas', 'adictivo'],
    userActions: ['reproducir', 'descargar', 'compartir', 'guardar', 'bucle'],
    audienceTerms: ['Generación Z', 'jóvenes', 'influencers', 'creadores de contenido'],
    trendTerms: ['cerebrito', 'skibidi', 'sigma', 'rizz', 'modo sigma']
  },
  portuguese: {
    locale: 'pt_BR',
    countryCode: 'BR',
    regionNames: ['Brasileiro', 'Português', 'Lusitano', 'Carioca', 'Paulista'],
    platforms: ['TikTok', 'Kwai', 'Instagram Reels', 'YouTube Shorts'],
    viralTerms: ['viral', 'tendência', 'meme sonoro', 'áudio popular', 'som do momento'],
    culturalReferences: ['meme brasileiro', 'humor br', 'zueira', 'pagodinho', 'fluxo'],
    emotions: ['engraçado', 'hilário', 'divertido', 'viciante', 'bizarro'],
    userActions: ['reproduzir', 'baixar', 'compartilhar', 'salvar', 'repetir'],
    audienceTerms: ['Geração Z', 'jovens', 'tiktokers', 'criadores de conteúdo'],
    trendTerms: ['bobagem mental', 'skibidi', 'sigma', 'brabíssimo', 'bombardiro crocodilo']
  },
  german: {
    locale: 'de_DE',
    countryCode: 'DE',
    regionNames: ['Deutsch', 'Österreichisch', 'Schweizerisch', 'Berliner'],
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    viralTerms: ['viral', 'trend', 'meme-sound', 'beliebter klang', 'audio-trend'],
    culturalReferences: ['deutsches meme', 'internet humor', 'streamer highlight', 'lustige töne'],
    emotions: ['lustig', 'witzig', 'unterhaltsam', 'amüsant', 'suchtgefahr'],
    userActions: ['abspielen', 'herunterladen', 'teilen', 'speichern', 'wiederholen'],
    audienceTerms: ['Generation Z', 'jugendliche', 'content creator', 'influencer'],
    trendTerms: ['gehirnfäule', 'skibidi', 'sigma', 'digga', 'wild']
  },
  russian: {
    locale: 'ru_RU',
    countryCode: 'RU',
    regionNames: ['Русский', 'Российский', 'Московский'],
    platforms: ['VK', 'TikTok', 'YouTube Shorts', 'Telegram'],
    viralTerms: ['вирусный', 'тренд', 'мем звук', 'популярное аудио', 'звуковой мем'],
    culturalReferences: ['русский мем', 'стрим', 'приколы', 'ржака', 'смешной звук'],
    emotions: ['смешно', 'весело', 'забавно', 'нелепо', 'затягивает'],
    userActions: ['воспроизвести', 'скачать', 'поделиться', 'сохранить', 'повторять'],
    audienceTerms: ['Поколение Z', 'молодежь', 'тиктокеры', 'стримеры'],
    trendTerms: ['мозговая гниль', 'скибиди', 'сигма', 'дерзкий', 'качает']
  },
  arabic: {
    locale: 'ar_SA',
    countryCode: 'SA',
    regionNames: ['عربي', 'خليجي', 'مصري', 'شامي', 'مغربي'],
    platforms: ['TikTok', 'Instagram Reels', 'Snapchat', 'YouTube Shorts'],
    viralTerms: ['فايرال', 'ترند', 'ميم صوتي', 'مقطع صوتي شهير', 'صوت منتشر'],
    culturalReferences: ['ميم عربي', 'مزاح', 'مقالب', 'صوت مضحك', 'فيديوهات مضحكة'],
    emotions: ['مضحك', 'مسلي', 'طريف', 'ممتع', 'إدمان'],
    userActions: ['تشغيل', 'تحميل', 'مشاركة', 'حفظ', 'تكرار'],
    audienceTerms: ['جيل زد', 'الشباب', 'صناع المحتوى', 'مؤثرون'],
    trendTerms: ['عطب دماغي', 'سكيبيدي', 'سيجما', 'قوي', 'يلا']
  },
  japanese: {
    locale: 'ja_JP',
    countryCode: 'JP',
    regionNames: ['日本', '東京', '大阪', '福岡'],
    platforms: ['TikTok', 'Instagram Reels', 'Line', 'YouTube Shorts', 'Twitter'],
    viralTerms: ['バイラル', 'トレンド', '人気の音声', '流行りの音', 'ミーム音声'],
    culturalReferences: ['日本のミーム', 'ネットスラング', '面白い音', 'ユーチューバー', 'VTuber'],
    emotions: ['面白い', '爆笑', 'クスクス', '中毒性', '楽しい'],
    userActions: ['再生', 'ダウンロード', '共有', '保存', 'リピート'],
    audienceTerms: ['Z世代', '若者', 'ティックトッカー', '配信者'],
    trendTerms: ['脳腐敗', 'スキビディ', 'シグマ', 'クセが強い', 'エモい']
  },
  korean: {
    locale: 'ko_KR',
    countryCode: 'KR',
    regionNames: ['한국', '서울', '부산'],
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Kakao'],
    viralTerms: ['바이럴', '트렌드', '밈 사운드', '인기 오디오', '유행 소리'],
    culturalReferences: ['한국 밈', '인터넷 유행어', '스트리머', '웹툰', '예능'],
    emotions: ['재미있는', '웃긴', '중독성 있는', '흥미로운', '킹받는'],
    userActions: ['재생', '다운로드', '공유', '저장', '반복'],
    audienceTerms: ['Z세대', 'MZ세대', '틱톡커', '크리에이터'],
    trendTerms: ['두뇌 부패', '스키비디', '시그마', '띵작', '킹받다']
  },
  vietnamese: {
    locale: 'vi_VN',
    countryCode: 'VN',
    regionNames: ['Việt Nam', 'Hà Nội', 'Sài Gòn', 'Đà Nẵng'],
    platforms: ['TikTok', 'Facebook', 'Instagram Reels', 'YouTube Shorts'],
    viralTerms: ['viral', 'xu hướng', 'meme âm thanh', 'âm thanh phổ biến', 'trend âm thanh'],
    culturalReferences: ['meme Việt Nam', 'hài hước', 'streamer', 'âm thanh vui nhộn'],
    emotions: ['hài hước', 'vui nhộn', 'cuốn', 'giải trí', 'gây nghiện'],
    userActions: ['phát', 'tải xuống', 'chia sẻ', 'lưu', 'lặp lại'],
    audienceTerms: ['Gen Z', 'giới trẻ', 'tiktoker', 'người sáng tạo nội dung'],
    trendTerms: ['ngu ngốc não', 'skibidi', 'sigma', 'đỉnh', 'chất']
  },
  chinese: {
    locale: 'zh_CN',
    countryCode: 'CN',
    regionNames: ['中国', '北京', '上海', '广州'],
    platforms: ['抖音', '小红书', 'Bilibili', '微信', '快手'],
    viralTerms: ['病毒式传播', '流行', '梗声音', '热门音频', '网络流行音效'],
    culturalReferences: ['中国梗', '网络用语', '主播', '搞笑声音', '表情包配音'],
    emotions: ['搞笑', '有趣', '魔性', '上头', '欢乐'],
    userActions: ['播放', '下载', '分享', '收藏', '循环'],
    audienceTerms: ['Z世代', '年轻人', '创作者', '网红'],
    trendTerms: ['脑腐烂', 'skibidi', '西格玛', '绝了', '太上头了']
  },
  french: {
    locale: 'fr_FR',
    countryCode: 'FR',
    regionNames: ['Français', 'Parisien', 'Québécois', 'Belge', 'Suisse'],
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Snapchat'],
    viralTerms: ['viral', 'tendance', 'mème sonore', 'son populaire', 'audio à la mode'],
    culturalReferences: ['mème français', 'humour internet', 'streameur', 'son amusant', 'délire'],
    emotions: ['drôle', 'hilarant', 'amusant', 'divertissant', 'addictif'],
    userActions: ['jouer', 'télécharger', 'partager', 'sauvegarder', 'boucler'],
    audienceTerms: ['Génération Z', 'jeunes', 'tiktokeurs', 'créateurs'],
    trendTerms: ['pourriture cérébrale', 'skibidi', 'sigma', 'dingue', 'quoi feur']
  },
  italian: {
    locale: 'it_IT',
    countryCode: 'IT',
    regionNames: ['Italiano', 'Romano', 'Milanese', 'Napoletano', 'Siciliano'],
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    viralTerms: ['virale', 'trend', 'meme sonoro', 'audio popolare', 'suono di tendenza'],
    culturalReferences: ['meme italiano', 'umorismo internet', 'streamer', 'suono divertente'],
    emotions: ['divertente', 'esilarante', 'spassoso', 'intrattenente', 'dipendenza'],
    userActions: ['riprodurre', 'scaricare', 'condividere', 'salvare', 'ripetere'],
    audienceTerms: ['Generazione Z', 'giovani', 'tiktoker', 'creator'],
    trendTerms: ['marciume cerebrale', 'skibidi', 'sigma', 'pazzesco', 'ma che fai']
  },
  turkish: {
    locale: 'tr_TR',
    countryCode: 'TR',
    regionNames: ['Türk', 'İstanbullu', 'Ankaralı', 'İzmirli'],
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    viralTerms: ['viral', 'trend', 'meme sesi', 'popüler ses', 'trend ses'],
    culturalReferences: ['türk meme', 'internet mizahı', 'yayıncı', 'komik ses', 'caps'],
    emotions: ['komik', 'eğlenceli', 'gülünç', 'keyifli', 'bağımlılık yapan'],
    userActions: ['oynat', 'indir', 'paylaş', 'kaydet', 'tekrarla'],
    audienceTerms: ['Z Kuşağı', 'gençler', 'tiktokçular', 'içerik üreticileri'],
    trendTerms: ['beyin çürümesi', 'skibidi', 'sigma', 'efsane', 'manyak']
  },
  hindi: {
    locale: 'hi_IN',
    countryCode: 'IN',
    regionNames: ['भारतीय', 'दिल्ली', 'मुंबई', 'बेंगलुरु'],
    platforms: ['Instagram Reels', 'YouTube Shorts', 'Moj', 'Josh', 'TikTok'],
    viralTerms: ['वायरल', 'ट्रेंड', 'मीम साउंड', 'लोकप्रिय ऑडियो', 'मशहूर आवाज़'],
    culturalReferences: ['भारतीय मीम', 'इंटरनेट ह्यूमर', 'स्ट्रीमर', 'मज़ेदार आवाज़', 'रील्स'],
    emotions: ['मज़ेदार', 'हंसीदार', 'मनोरंजक', 'दिलचस्प', 'लत लगने वाला'],
    userActions: ['प्ले करें', 'डाउनलोड करें', 'शेयर करें', 'सेव करें', 'दोहराएं'],
    audienceTerms: ['जेन Z', 'युवा', 'रील्स बनाने वाले', 'कंटेंट क्रिएटर्स'],
    trendTerms: ['दिमाग का कचरा', 'स्किबिडी', 'सिग्मा', 'मस्त', 'धमाल']
  },
  hebrew: {
    locale: 'he_IL',
    countryCode: 'IL',
    regionNames: ['ישראלי', 'תל אביבי', 'ירושלמי', 'חיפאי'],
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    viralTerms: ["הפרלמנט", 'טרנד' ,"הקלטות שוברות" , "ישראלים מפגרים" ],
    culturalReferences: ['מם ישראלי', 'הומור אינטרנטי', 'סטרימר', 'צליל מצחיק', 'סרטונים'],
    emotions: ['מצחיק', 'משעשע', 'מבדר', 'מהנה', 'ממכר'],
    userActions: ['הפעל', 'הורד', 'שתף', 'שמור', 'חזור'],
    audienceTerms: ['דור Z', 'צעירים', 'יוצרי תוכן', 'טיקטוקרים'],
    trendTerms: ['ריקבון מוח', 'סקיבידי', 'סיגמה', 'מטורף', 'מתן מה לא פורים']
  }
};

// Structure to hold description templates for different sound types
const descriptionTemplates = {
  meme: {
    english: (sound: SoundSEOMetadata) => 
      `Play "${sound.name}" meme sound 🔊 - viral TikTok audio trending on ${getRandomItem(LANGUAGE_SEO_DATA.english.platforms)}. This ${sound.length}s clip is perfect for creating funny videos, reactions, and ${getRandomItem(LANGUAGE_SEO_DATA.english.trendTerms)} content. #brainrot #viral #${sound.hashtags?.[0] || 'meme'}`,
    
    spanish: (sound: SoundSEOMetadata) => 
      `Reproduce "${sound.name}" 🔊 - sonido viral de ${getRandomItem(LANGUAGE_SEO_DATA.spanish.platforms)} que está ${getRandomItem(LANGUAGE_SEO_DATA.spanish.viralTerms)}. Este clip de ${sound.length} segundos es perfecto para videos graciosos y ${getRandomItem(LANGUAGE_SEO_DATA.spanish.emotions)}. #brainrot #viral #${sound.hashtags?.[0] || 'meme'}`,
    
    portuguese: (sound: SoundSEOMetadata) => 
      `Reproduza "${sound.name}" 🔊 - áudio viral do ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.platforms)} que está ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.viralTerms)}. Este clipe de ${sound.length} segundos é perfeito para vídeos ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.emotions)} e conteúdo ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.trendTerms)}. #brainrot #viral #${sound.hashtags?.[0] || 'meme'}`,
    
    german: (sound: SoundSEOMetadata) => 
      `Spiele "${sound.name}" Meme-Sound 🔊 - virales Audio auf ${getRandomItem(LANGUAGE_SEO_DATA.german.platforms)} im Trend. Dieser ${sound.length}s Clip ist perfekt für ${getRandomItem(LANGUAGE_SEO_DATA.german.emotions)} Videos und ${getRandomItem(LANGUAGE_SEO_DATA.german.trendTerms)} Inhalte. #brainrot #viral #${sound.hashtags?.[0] || 'meme'}`,
    
    russian: (sound: SoundSEOMetadata) => 
      `Воспроизведи звук мема "${sound.name}" 🔊 - вирусное аудио из ${getRandomItem(LANGUAGE_SEO_DATA.russian.platforms)}. Этот ${sound.length}-секундный клип идеален для ${getRandomItem(LANGUAGE_SEO_DATA.russian.emotions)} видео и контента в стиле ${getRandomItem(LANGUAGE_SEO_DATA.russian.trendTerms)}. #brainrot #вирусный #${sound.hashtags?.[0] || 'мем'}`,
    
    arabic: (sound: SoundSEOMetadata) => 
      `تشغيل صوت الميم "${sound.name}" 🔊 - مقطع صوتي ${getRandomItem(LANGUAGE_SEO_DATA.arabic.viralTerms)} على ${getRandomItem(LANGUAGE_SEO_DATA.arabic.platforms)}. هذا المقطع البالغ ${sound.length} ثانية مثالي لإنشاء مقاطع فيديو ${getRandomItem(LANGUAGE_SEO_DATA.arabic.emotions)} ومحتوى ${getRandomItem(LANGUAGE_SEO_DATA.arabic.trendTerms)}. #brainrot #فايرال #${sound.hashtags?.[0] || 'ميم'}`,
    
    japanese: (sound: SoundSEOMetadata) => 
      `"${sound.name}"ミーム音声を再生 🔊 - ${getRandomItem(LANGUAGE_SEO_DATA.japanese.platforms)}で${getRandomItem(LANGUAGE_SEO_DATA.japanese.viralTerms)}。この${sound.length}秒クリップは${getRandomItem(LANGUAGE_SEO_DATA.japanese.emotions)}動画や${getRandomItem(LANGUAGE_SEO_DATA.japanese.trendTerms)}コンテンツ作成に最適です。#brainrot #バイラル #${sound.hashtags?.[0] || 'ミーム'}`,
    
    korean: (sound: SoundSEOMetadata) => 
      `"${sound.name}" 밈 사운드 재생 🔊 - ${getRandomItem(LANGUAGE_SEO_DATA.korean.platforms)}에서 ${getRandomItem(LANGUAGE_SEO_DATA.korean.viralTerms)}. 이 ${sound.length}초 클립은 ${getRandomItem(LANGUAGE_SEO_DATA.korean.emotions)} 비디오와 ${getRandomItem(LANGUAGE_SEO_DATA.korean.trendTerms)} 콘텐츠 제작에 완벽합니다. #brainrot #바이럴 #${sound.hashtags?.[0] || '밈'}`,
    
    vietnamese: (sound: SoundSEOMetadata) => 
      `Phát âm thanh meme "${sound.name}" 🔊 - audio ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.viralTerms)} trên ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.platforms)}. Clip ${sound.length}s này hoàn hảo để tạo video ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.emotions)} và nội dung ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.trendTerms)}. #brainrot #viral #${sound.hashtags?.[0] || 'meme'}`,
    
    chinese: (sound: SoundSEOMetadata) => 
      `播放"${sound.name}"梗声音 🔊 - ${getRandomItem(LANGUAGE_SEO_DATA.chinese.platforms)}上的${getRandomItem(LANGUAGE_SEO_DATA.chinese.viralTerms)}音频。这个${sound.length}秒的片段非常适合制作${getRandomItem(LANGUAGE_SEO_DATA.chinese.emotions)}视频和${getRandomItem(LANGUAGE_SEO_DATA.chinese.trendTerms)}内容。#脑腐烂 #病毒式传播 #${sound.hashtags?.[0] || '梗'}`,
    
    french: (sound: SoundSEOMetadata) => 
      `Jouer le son mème "${sound.name}" 🔊 - audio viral sur ${getRandomItem(LANGUAGE_SEO_DATA.french.platforms)}. Ce clip de ${sound.length}s est parfait pour créer des vidéos ${getRandomItem(LANGUAGE_SEO_DATA.french.emotions)} et du contenu ${getRandomItem(LANGUAGE_SEO_DATA.french.trendTerms)}. #brainrot #viral #${sound.hashtags?.[0] || 'meme'}`,
    
    italian: (sound: SoundSEOMetadata) => 
      `Riproduci il suono del meme "${sound.name}" 🔊 - audio virale su ${getRandomItem(LANGUAGE_SEO_DATA.italian.platforms)}. Questo clip di ${sound.length}s è perfetto per creare video ${getRandomItem(LANGUAGE_SEO_DATA.italian.emotions)} e contenuti ${getRandomItem(LANGUAGE_SEO_DATA.italian.trendTerms)}. #brainrot #virale #${sound.hashtags?.[0] || 'meme'}`,
    
    turkish: (sound: SoundSEOMetadata) => 
      `"${sound.name}" meme sesini oynat 🔊 - ${getRandomItem(LANGUAGE_SEO_DATA.turkish.platforms)} üzerinde viral ses. Bu ${sound.length}s klip, ${getRandomItem(LANGUAGE_SEO_DATA.turkish.emotions)} videolar ve ${getRandomItem(LANGUAGE_SEO_DATA.turkish.trendTerms)} içerikler oluşturmak için mükemmel. #brainrot #viral #${sound.hashtags?.[0] || 'meme'}`,
    
    hindi: (sound: SoundSEOMetadata) => 
      `"${sound.name}" मीम साउंड प्ले करें 🔊 - ${getRandomItem(LANGUAGE_SEO_DATA.hindi.platforms)} पर वायरल ऑडियो। यह ${sound.length}s क्लिप ${getRandomItem(LANGUAGE_SEO_DATA.hindi.emotions)} वीडियो और ${getRandomItem(LANGUAGE_SEO_DATA.hindi.trendTerms)} कंटेंट बनाने के लिए एकदम सही है। #brainrot #वायरल #${sound.hashtags?.[0] || 'मीम'}`,
    
    hebrew: (sound: SoundSEOMetadata) => 
      `הפעל את צליל המם "${sound.name}" 🔊 - אודיו ${getRandomItem(LANGUAGE_SEO_DATA.hebrew.viralTerms)} ב-${getRandomItem(LANGUAGE_SEO_DATA.hebrew.platforms)}. קליפ זה של ${sound.length} שניות מושלם ליצירת סרטונים ${getRandomItem(LANGUAGE_SEO_DATA.hebrew.emotions)} ותוכן ${getRandomItem(LANGUAGE_SEO_DATA.hebrew.trendTerms)}. #brainrot #ויראלי #${sound.hashtags?.[0] || 'מם'}`
  },
  
  viral: {
    english: (sound: SoundSEOMetadata) => 
      `"${sound.name}" is blowing up on ${getRandomItem(LANGUAGE_SEO_DATA.english.platforms)}! Use this ${getRandomItem(LANGUAGE_SEO_DATA.english.emotions)} ${sound.length}s sound in your videos. Popular with ${getRandomItem(LANGUAGE_SEO_DATA.english.audienceTerms)} and ${getRandomItem(LANGUAGE_SEO_DATA.english.regionNames)} creators. #${getRandomItem(LANGUAGE_SEO_DATA.english.trendTerms)} #viral`,
    
    spanish: (sound: SoundSEOMetadata) => 
      `"${sound.name}" está explotando en ${getRandomItem(LANGUAGE_SEO_DATA.spanish.platforms)}! Usa este sonido ${getRandomItem(LANGUAGE_SEO_DATA.spanish.emotions)} de ${sound.length} segundos en tus videos. Popular entre ${getRandomItem(LANGUAGE_SEO_DATA.spanish.audienceTerms)} y creadores ${getRandomItem(LANGUAGE_SEO_DATA.spanish.regionNames)}. #${getRandomItem(LANGUAGE_SEO_DATA.spanish.trendTerms)} #viral`,
    
    portuguese: (sound: SoundSEOMetadata) => 
      `"${sound.name}" está bombando no ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.platforms)}! Use este som ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.emotions)} de ${sound.length} segundos nos seus vídeos. Popular entre ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.audienceTerms)} e criadores ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.regionNames)}. #${getRandomItem(LANGUAGE_SEO_DATA.portuguese.trendTerms)} #viral`,
    
    german: (sound: SoundSEOMetadata) => 
      `"${sound.name}" geht ab auf ${getRandomItem(LANGUAGE_SEO_DATA.german.platforms)}! Verwende diesen ${getRandomItem(LANGUAGE_SEO_DATA.german.emotions)} ${sound.length}s Sound in deinen Videos. Beliebt bei ${getRandomItem(LANGUAGE_SEO_DATA.german.audienceTerms)} und ${getRandomItem(LANGUAGE_SEO_DATA.german.regionNames)} Erstellern. #${getRandomItem(LANGUAGE_SEO_DATA.german.trendTerms)} #viral`,
    
    russian: (sound: SoundSEOMetadata) => 
      `"${sound.name}" взрывает ${getRandomItem(LANGUAGE_SEO_DATA.russian.platforms)}! Используйте этот ${getRandomItem(LANGUAGE_SEO_DATA.russian.emotions)} ${sound.length}-секундный звук в своих видео. Популярен среди ${getRandomItem(LANGUAGE_SEO_DATA.russian.audienceTerms)} и ${getRandomItem(LANGUAGE_SEO_DATA.russian.regionNames)} создателей. #${getRandomItem(LANGUAGE_SEO_DATA.russian.trendTerms)} #вирусный`,
    
    arabic: (sound: SoundSEOMetadata) => 
      `"${sound.name}" ينتشر بقوة على ${getRandomItem(LANGUAGE_SEO_DATA.arabic.platforms)}! استخدم هذا الصوت ${getRandomItem(LANGUAGE_SEO_DATA.arabic.emotions)} لمدة ${sound.length} ثانية في مقاطع الفيديو الخاصة بك. شائع بين ${getRandomItem(LANGUAGE_SEO_DATA.arabic.audienceTerms)} ومنشئي المحتوى ${getRandomItem(LANGUAGE_SEO_DATA.arabic.regionNames)}. #${getRandomItem(LANGUAGE_SEO_DATA.arabic.trendTerms)} #فايرال`,
    
    japanese: (sound: SoundSEOMetadata) => 
      `"${sound.name}"が${getRandomItem(LANGUAGE_SEO_DATA.japanese.platforms)}で大流行中！この${getRandomItem(LANGUAGE_SEO_DATA.japanese.emotions)}${sound.length}秒サウンドをあなたの動画に使用しましょう。${getRandomItem(LANGUAGE_SEO_DATA.japanese.audienceTerms)}や${getRandomItem(LANGUAGE_SEO_DATA.japanese.regionNames)}のクリエイターに人気です。#${getRandomItem(LANGUAGE_SEO_DATA.japanese.trendTerms)} #バイラル`,
    
    korean: (sound: SoundSEOMetadata) => 
      `"${sound.name}"이(가) ${getRandomItem(LANGUAGE_SEO_DATA.korean.platforms)}에서 대유행 중입니다! 이 ${getRandomItem(LANGUAGE_SEO_DATA.korean.emotions)} ${sound.length}초 사운드를 영상에 사용해 보세요. ${getRandomItem(LANGUAGE_SEO_DATA.korean.audienceTerms)}와(과) ${getRandomItem(LANGUAGE_SEO_DATA.korean.regionNames)} 크리에이터들 사이에 인기가 많습니다. #${getRandomItem(LANGUAGE_SEO_DATA.korean.trendTerms)} #바이럴`,
    
    vietnamese: (sound: SoundSEOMetadata) => 
      `"${sound.name}" đang bùng nổ trên ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.platforms)}! Sử dụng âm thanh ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.emotions)} ${sound.length}s này trong video của bạn. Phổ biến với ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.audienceTerms)} và người sáng tạo ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.regionNames)}. #${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.trendTerms)} #viral`,
    
    chinese: (sound: SoundSEOMetadata) => 
      `"${sound.name}"在${getRandomItem(LANGUAGE_SEO_DATA.chinese.platforms)}上爆火！在你的视频中使用这个${getRandomItem(LANGUAGE_SEO_DATA.chinese.emotions)}的${sound.length}秒声音。在${getRandomItem(LANGUAGE_SEO_DATA.chinese.audienceTerms)}和${getRandomItem(LANGUAGE_SEO_DATA.chinese.regionNames)}创作者中很受欢迎。#${getRandomItem(LANGUAGE_SEO_DATA.chinese.trendTerms)} #病毒式传播`,
    
    french: (sound: SoundSEOMetadata) => 
      `"${sound.name}" explose sur ${getRandomItem(LANGUAGE_SEO_DATA.french.platforms)} ! Utilisez ce son ${getRandomItem(LANGUAGE_SEO_DATA.french.emotions)} de ${sound.length}s dans vos vidéos. Populaire parmi les ${getRandomItem(LANGUAGE_SEO_DATA.french.audienceTerms)} et les créateurs ${getRandomItem(LANGUAGE_SEO_DATA.french.regionNames)}. #${getRandomItem(LANGUAGE_SEO_DATA.french.trendTerms)} #viral`,
    
    italian: (sound: SoundSEOMetadata) => 
      `"${sound.name}" sta spopolando su ${getRandomItem(LANGUAGE_SEO_DATA.italian.platforms)}! Usa questo suono ${getRandomItem(LANGUAGE_SEO_DATA.italian.emotions)} di ${sound.length}s nei tuoi video. Popolare tra ${getRandomItem(LANGUAGE_SEO_DATA.italian.audienceTerms)} e creator ${getRandomItem(LANGUAGE_SEO_DATA.italian.regionNames)}. #${getRandomItem(LANGUAGE_SEO_DATA.italian.trendTerms)} #virale`,
    
    turkish: (sound: SoundSEOMetadata) => 
      `"${sound.name}" ${getRandomItem(LANGUAGE_SEO_DATA.turkish.platforms)} üzerinde patlıyor! Bu ${getRandomItem(LANGUAGE_SEO_DATA.turkish.emotions)} ${sound.length}s sesi videolarınızda kullanın. ${getRandomItem(LANGUAGE_SEO_DATA.turkish.audienceTerms)} ve ${getRandomItem(LANGUAGE_SEO_DATA.turkish.regionNames)} içerik üreticileri arasında popüler. #${getRandomItem(LANGUAGE_SEO_DATA.turkish.trendTerms)} #viral`,
    
    hindi: (sound: SoundSEOMetadata) => 
      `"${sound.name}" ${getRandomItem(LANGUAGE_SEO_DATA.hindi.platforms)} पर धमाल मचा रहा है! अपने वीडियोज़ में इस ${getRandomItem(LANGUAGE_SEO_DATA.hindi.emotions)} ${sound.length}s साउंड का उपयोग करें। ${getRandomItem(LANGUAGE_SEO_DATA.hindi.audienceTerms)} और ${getRandomItem(LANGUAGE_SEO_DATA.hindi.regionNames)} क्रिएटर्स के बीच लोकप्रिय। #${getRandomItem(LANGUAGE_SEO_DATA.hindi.trendTerms)} #वायरल`,
    
    hebrew: (sound: SoundSEOMetadata) => 
      `"${sound.name}" מתפוצץ ב-${getRandomItem(LANGUAGE_SEO_DATA.hebrew.platforms)}! השתמש בצליל ${getRandomItem(LANGUAGE_SEO_DATA.hebrew.emotions)} זה של ${sound.length} שניות בסרטונים שלך. פופולרי בקרב ${getRandomItem(LANGUAGE_SEO_DATA.hebrew.audienceTerms)} ויוצרי תוכן ${getRandomItem(LANGUAGE_SEO_DATA.hebrew.regionNames)}. #${getRandomItem(LANGUAGE_SEO_DATA.hebrew.trendTerms)} #ויראלי`
  },
  
  trend: {
    english: (sound: SoundSEOMetadata) => 
      `Join the "${sound.name}" trend 🌊 - everyone on ${getRandomItem(LANGUAGE_SEO_DATA.english.platforms)} is using this ${sound.length}s sound. Create your own ${getRandomItem(LANGUAGE_SEO_DATA.english.emotions)} video with this trending audio. Perfect for ${getRandomItem(LANGUAGE_SEO_DATA.english.audienceTerms)}. #trend #${getRandomItem(LANGUAGE_SEO_DATA.english.trendTerms)} #fyp`,
    
    spanish: (sound: SoundSEOMetadata) => 
      `Únete a la tendencia "${sound.name}" 🌊 - todos en ${getRandomItem(LANGUAGE_SEO_DATA.spanish.platforms)} están usando este sonido de ${sound.length} segundos. Crea tu propio video ${getRandomItem(LANGUAGE_SEO_DATA.spanish.emotions)} con este audio en tendencia. Perfecto para ${getRandomItem(LANGUAGE_SEO_DATA.spanish.audienceTerms)}. #tendencia #${getRandomItem(LANGUAGE_SEO_DATA.spanish.trendTerms)} #parati`,
    
    portuguese: (sound: SoundSEOMetadata) => 
      `Entre na tendência "${sound.name}" 🌊 - todo mundo no ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.platforms)} está usando este som de ${sound.length} segundos. Crie seu próprio vídeo ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.emotions)} com este áudio em alta. Perfeito para ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.audienceTerms)}. #tendencia #${getRandomItem(LANGUAGE_SEO_DATA.portuguese.trendTerms)} #paravocê`,
    
    german: (sound: SoundSEOMetadata) => 
      `Mach mit beim "${sound.name}" Trend 🌊 - jeder auf ${getRandomItem(LANGUAGE_SEO_DATA.german.platforms)} verwendet diesen ${sound.length}s Sound. Erstelle dein eigenes ${getRandomItem(LANGUAGE_SEO_DATA.german.emotions)} Video mit diesem trendigen Audio. Perfekt für ${getRandomItem(LANGUAGE_SEO_DATA.german.audienceTerms)}. #trend #${getRandomItem(LANGUAGE_SEO_DATA.german.trendTerms)} #fyp`,
    
    russian: (sound: SoundSEOMetadata) => 
      `Присоединяйся к тренду "${sound.name}" 🌊 - все на ${getRandomItem(LANGUAGE_SEO_DATA.russian.platforms)} используют этот ${sound.length}-секундный звук. Создавай своё ${getRandomItem(LANGUAGE_SEO_DATA.russian.emotions)} видео с этим популярным аудио. Идеально для ${getRandomItem(LANGUAGE_SEO_DATA.russian.audienceTerms)}. #тренд #${getRandomItem(LANGUAGE_SEO_DATA.russian.trendTerms)} #рекомендации`,
    
    arabic: (sound: SoundSEOMetadata) => 
      `انضم إلى ترند "${sound.name}" 🌊 - الجميع على ${getRandomItem(LANGUAGE_SEO_DATA.arabic.platforms)} يستخدمون هذا الصوت لمدة ${sound.length} ثانية. أنشئ فيديو ${getRandomItem(LANGUAGE_SEO_DATA.arabic.emotions)} الخاص بك باستخدام هذا المقطع الصوتي الشائع. مثالي لـ ${getRandomItem(LANGUAGE_SEO_DATA.arabic.audienceTerms)}. #ترند #${getRandomItem(LANGUAGE_SEO_DATA.arabic.trendTerms)} #اكسبلور`,
    
    japanese: (sound: SoundSEOMetadata) => 
      `"${sound.name}"トレンドに参加しよう 🌊 - ${getRandomItem(LANGUAGE_SEO_DATA.japanese.platforms)}のみんながこの${sound.length}秒のサウンドを使っています。このトレンド中のオーディオであなた自身の${getRandomItem(LANGUAGE_SEO_DATA.japanese.emotions)}動画を作りましょう。${getRandomItem(LANGUAGE_SEO_DATA.japanese.audienceTerms)}に最適です。#トレンド #${getRandomItem(LANGUAGE_SEO_DATA.japanese.trendTerms)} #おすすめ`,
    
    korean: (sound: SoundSEOMetadata) => 
      `"${sound.name}" 트렌드에 참여하세요 🌊 - ${getRandomItem(LANGUAGE_SEO_DATA.korean.platforms)}의 모든 사람들이 이 ${sound.length}초 사운드를 사용하고 있습니다. 이 트렌딩 오디오로 당신만의 ${getRandomItem(LANGUAGE_SEO_DATA.korean.emotions)} 비디오를 만드세요. ${getRandomItem(LANGUAGE_SEO_DATA.korean.audienceTerms)}에게 완벽합니다. #트렌드 #${getRandomItem(LANGUAGE_SEO_DATA.korean.trendTerms)} #추천`,
    
    vietnamese: (sound: SoundSEOMetadata) => 
      `Tham gia xu hướng "${sound.name}" 🌊 - mọi người trên ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.platforms)} đang sử dụng âm thanh ${sound.length}s này. Tạo video ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.emotions)} của riêng bạn với audio đang thịnh hành này. Hoàn hảo cho ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.audienceTerms)}. #xuhuong #${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.trendTerms)} #foryou`,
    
    chinese: (sound: SoundSEOMetadata) => 
      `加入"${sound.name}"潮流 🌊 - ${getRandomItem(LANGUAGE_SEO_DATA.chinese.platforms)}上的每个人都在使用这个${sound.length}秒的声音。用这个流行音频创建你自己的${getRandomItem(LANGUAGE_SEO_DATA.chinese.emotions)}视频。非常适合${getRandomItem(LANGUAGE_SEO_DATA.chinese.audienceTerms)}。#潮流 #${getRandomItem(LANGUAGE_SEO_DATA.chinese.trendTerms)} #推荐`,
    
    french: (sound: SoundSEOMetadata) => 
      `Rejoignez la tendance "${sound.name}" 🌊 - tout le monde sur ${getRandomItem(LANGUAGE_SEO_DATA.french.platforms)} utilise ce son de ${sound.length}s. Créez votre propre vidéo ${getRandomItem(LANGUAGE_SEO_DATA.french.emotions)} avec cet audio tendance. Parfait pour les ${getRandomItem(LANGUAGE_SEO_DATA.french.audienceTerms)}. #tendance #${getRandomItem(LANGUAGE_SEO_DATA.french.trendTerms)} #pourtoi`,
    
    italian: (sound: SoundSEOMetadata) => 
      `Unisciti al trend "${sound.name}" 🌊 - tutti su ${getRandomItem(LANGUAGE_SEO_DATA.italian.platforms)} stanno usando questo suono di ${sound.length}s. Crea il tuo video ${getRandomItem(LANGUAGE_SEO_DATA.italian.emotions)} con questo audio di tendenza. Perfetto per ${getRandomItem(LANGUAGE_SEO_DATA.italian.audienceTerms)}. #trend #${getRandomItem(LANGUAGE_SEO_DATA.italian.trendTerms)} #perte`,
    
    turkish: (sound: SoundSEOMetadata) => 
      `"${sound.name}" trendine katıl 🌊 - ${getRandomItem(LANGUAGE_SEO_DATA.turkish.platforms)} üzerindeki herkes bu ${sound.length}s sesi kullanıyor. Bu trend olan ses ile kendi ${getRandomItem(LANGUAGE_SEO_DATA.turkish.emotions)} videonu oluştur. ${getRandomItem(LANGUAGE_SEO_DATA.turkish.audienceTerms)} için mükemmel. #trend #${getRandomItem(LANGUAGE_SEO_DATA.turkish.trendTerms)} #keşfet`,
    
    hindi: (sound: SoundSEOMetadata) => 
      `"${sound.name}" ट्रेंड में शामिल हों 🌊 - ${getRandomItem(LANGUAGE_SEO_DATA.hindi.platforms)} पर हर कोई इस ${sound.length}s साउंड का उपयोग कर रहा है। इस ट्रेंडिंग ऑडियो के साथ अपना ${getRandomItem(LANGUAGE_SEO_DATA.hindi.emotions)} वीडियो बनाएं। ${getRandomItem(LANGUAGE_SEO_DATA.hindi.audienceTerms)} के लिए एकदम सही। #ट्रेंड #${getRandomItem(LANGUAGE_SEO_DATA.hindi.trendTerms)} #foryou`,
    
    hebrew: (sound: SoundSEOMetadata) => 
      `הצטרף לטרנד "${sound.name}" 🌊 - כולם ב-${getRandomItem(LANGUAGE_SEO_DATA.hebrew.platforms)} משתמשים בצליל זה של ${sound.length} שניות. צור את הסרטון ה${getRandomItem(LANGUAGE_SEO_DATA.hebrew.emotions)} שלך עם האודיו הטרנדי הזה. מושלם עבור ${getRandomItem(LANGUAGE_SEO_DATA.hebrew.audienceTerms)}. #טרנד #${getRandomItem(LANGUAGE_SEO_DATA.hebrew.trendTerms)} #עבורך`
  },
  
  reaction: {
    english: (sound: SoundSEOMetadata) => 
      `Perfect ${getRandomItem(LANGUAGE_SEO_DATA.english.emotions)} reaction sound! "${sound.name}" captures that exact feeling when ${getRandomItem(['someone surprises you', 'you see something shocking', 'something unexpected happens', 'you cannot believe your eyes'])}. ${sound.length}s of pure ${getRandomItem(LANGUAGE_SEO_DATA.english.emotions)} energy! #reaction #${sound.hashtags?.[0] || 'meme'} #${getRandomItem(LANGUAGE_SEO_DATA.english.trendTerms)}`,
    
    spanish: (sound: SoundSEOMetadata) => 
      `¡Sonido de reacción ${getRandomItem(LANGUAGE_SEO_DATA.spanish.emotions)} perfecto! "${sound.name}" captura ese sentimiento exacto cuando ${getRandomItem(['alguien te sorprende', 'ves algo impactante', 'ocurre algo inesperado', 'no puedes creer lo que ves'])}. ¡${sound.length} segundos de pura energía ${getRandomItem(LANGUAGE_SEO_DATA.spanish.emotions)}! #reaccion #${sound.hashtags?.[0] || 'meme'} #${getRandomItem(LANGUAGE_SEO_DATA.spanish.trendTerms)}`,
    
    portuguese: (sound: SoundSEOMetadata) => 
      `Som de reação ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.emotions)} perfeito! "${sound.name}" captura exatamente aquele sentimento quando ${getRandomItem(['alguém te surpreende', 'você vê algo chocante', 'algo inesperado acontece', 'você não consegue acreditar no que vê'])}. ${sound.length} segundos de pura energia ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.emotions)}! #reacao #${sound.hashtags?.[0] || 'meme'} #${getRandomItem(LANGUAGE_SEO_DATA.portuguese.trendTerms)}`,
    
    german: (sound: SoundSEOMetadata) => 
      `Perfekter ${getRandomItem(LANGUAGE_SEO_DATA.german.emotions)} Reaktionssound! "${sound.name}" erfasst genau dieses Gefühl, wenn ${getRandomItem(['dich jemand überrascht', 'du etwas Schockierendes siehst', 'etwas Unerwartetes passiert', 'du deinen Augen nicht trauen kannst'])}. ${sound.length}s pure ${getRandomItem(LANGUAGE_SEO_DATA.german.emotions)} Energie! #reaktion #${sound.hashtags?.[0] || 'meme'} #${getRandomItem(LANGUAGE_SEO_DATA.german.trendTerms)}`,
    
    russian: (sound: SoundSEOMetadata) => 
      `Идеальный ${getRandomItem(LANGUAGE_SEO_DATA.russian.emotions)} звук реакции! "${sound.name}" передает то самое чувство, когда ${getRandomItem(['кто-то удивляет тебя', 'ты видишь что-то шокирующее', 'происходит что-то неожиданное', 'ты не можешь поверить своим глазам'])}. ${sound.length} секунд чистой ${getRandomItem(LANGUAGE_SEO_DATA.russian.emotions)} энергии! #реакция #${sound.hashtags?.[0] || 'мем'} #${getRandomItem(LANGUAGE_SEO_DATA.russian.trendTerms)}`,
    
    arabic: (sound: SoundSEOMetadata) => 
      `صوت رد فعل ${getRandomItem(LANGUAGE_SEO_DATA.arabic.emotions)} مثالي! "${sound.name}" يلتقط ذلك الشعور تماماً عندما ${getRandomItem(['يفاجئك شخص ما', 'ترى شيئًا صادمًا', 'يحدث شيء غير متوقع', 'لا تصدق عينيك'])}. ${sound.length} ثانية من طاقة ${getRandomItem(LANGUAGE_SEO_DATA.arabic.emotions)} الخالصة! #ردة_فعل #${sound.hashtags?.[0] || 'ميم'} #${getRandomItem(LANGUAGE_SEO_DATA.arabic.trendTerms)}`,
    
    japanese: (sound: SoundSEOMetadata) => 
      `完璧な${getRandomItem(LANGUAGE_SEO_DATA.japanese.emotions)}リアクションサウンド！"${sound.name}"は${getRandomItem(['誰かにびっくりさせられた', '衝撃的なものを見た', '予想外のことが起こった', '自分の目を疑う'])}ときの感覚をそのまま捉えています。純粋な${getRandomItem(LANGUAGE_SEO_DATA.japanese.emotions)}エネルギーの${sound.length}秒！#リアクション #${sound.hashtags?.[0] || 'ミーム'} #${getRandomItem(LANGUAGE_SEO_DATA.japanese.trendTerms)}`,
    
    korean: (sound: SoundSEOMetadata) => 
      `완벽한 ${getRandomItem(LANGUAGE_SEO_DATA.korean.emotions)} 리액션 사운드! "${sound.name}"는 ${getRandomItem(['누군가가 당신을 놀라게 할 때', '충격적인 것을 볼 때', '예상치 못한 일이 발생할 때', '자신의 눈을 믿을 수 없을 때'])}의 느낌을 정확히 포착합니다. 순수한 ${getRandomItem(LANGUAGE_SEO_DATA.korean.emotions)} 에너지 ${sound.length}초! #리액션 #${sound.hashtags?.[0] || '밈'} #${getRandomItem(LANGUAGE_SEO_DATA.korean.trendTerms)}`,
    
    vietnamese: (sound: SoundSEOMetadata) => 
      `Âm thanh phản ứng ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.emotions)} hoàn hảo! "${sound.name}" nắm bắt chính xác cảm giác đó khi ${getRandomItem(['ai đó làm bạn ngạc nhiên', 'bạn thấy điều gì đó gây sốc', 'điều bất ngờ xảy ra', 'bạn không thể tin vào mắt mình'])}. ${sound.length}s năng lượng ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.emotions)} thuần túy! #phanung #${sound.hashtags?.[0] || 'meme'} #${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.trendTerms)}`,
    
    chinese: (sound: SoundSEOMetadata) => 
      `完美的${getRandomItem(LANGUAGE_SEO_DATA.chinese.emotions)}反应声音！"${sound.name}"捕捉到当${getRandomItem(['有人让你惊讶', '你看到令人震惊的事情', '发生了意想不到的事情', '你不敢相信自己的眼睛'])}时的那种感觉。${sound.length}秒纯${getRandomItem(LANGUAGE_SEO_DATA.chinese.emotions)}能量！#反应 #${sound.hashtags?.[0] || '梗'} #${getRandomItem(LANGUAGE_SEO_DATA.chinese.trendTerms)}`,
    
    french: (sound: SoundSEOMetadata) => 
      `Son de réaction ${getRandomItem(LANGUAGE_SEO_DATA.french.emotions)} parfait ! "${sound.name}" capture exactement ce sentiment quand ${getRandomItem(['quelqu\'un vous surprend', 'vous voyez quelque chose de choquant', 'quelque chose d\'inattendu se produit', 'vous n\'en croyez pas vos yeux'])}. ${sound.length}s d'énergie ${getRandomItem(LANGUAGE_SEO_DATA.french.emotions)} pure ! #reaction #${sound.hashtags?.[0] || 'meme'} #${getRandomItem(LANGUAGE_SEO_DATA.french.trendTerms)}`,
    
    italian: (sound: SoundSEOMetadata) => 
      `Suono di reazione ${getRandomItem(LANGUAGE_SEO_DATA.italian.emotions)} perfetto! "${sound.name}" cattura esattamente quella sensazione quando ${getRandomItem(['qualcuno ti sorprende', 'vedi qualcosa di scioccante', 'succede qualcosa di inaspettato', 'non puoi credere ai tuoi occhi'])}. ${sound.length}s di pura energia ${getRandomItem(LANGUAGE_SEO_DATA.italian.emotions)}! #reazione #${sound.hashtags?.[0] || 'meme'} #${getRandomItem(LANGUAGE_SEO_DATA.italian.trendTerms)}`,
    
    turkish: (sound: SoundSEOMetadata) => 
      `Mükemmel ${getRandomItem(LANGUAGE_SEO_DATA.turkish.emotions)} tepki sesi! "${sound.name}" ${getRandomItem(['biri seni şaşırttığında', 'şok edici bir şey gördüğünde', 'beklenmedik bir şey olduğunda', 'gözlerine inanamadığında'])} hissedilen duyguyu tam olarak yakalıyor. Saf ${getRandomItem(LANGUAGE_SEO_DATA.turkish.emotions)} enerjisinin ${sound.length} saniyesi! #tepki #${sound.hashtags?.[0] || 'meme'} #${getRandomItem(LANGUAGE_SEO_DATA.turkish.trendTerms)}`,
    
    hindi: (sound: SoundSEOMetadata) => 
      `एकदम सही ${getRandomItem(LANGUAGE_SEO_DATA.hindi.emotions)} रिएक्शन साउंड! "${sound.name}" उस एहसास को कैप्चर करता है जब ${getRandomItem(['कोई आपको आश्चर्यचकित करता है', 'आप कुछ चौंकाने वाला देखते हैं', 'कुछ अनपेक्षित होता है', 'आप अपनी आंखों पर विश्वास नहीं कर पाते'])}। शुद्ध ${getRandomItem(LANGUAGE_SEO_DATA.hindi.emotions)} ऊर्जा के ${sound.length} सेकंड! #रिएक्शन #${sound.hashtags?.[0] || 'मीम'} #${getRandomItem(LANGUAGE_SEO_DATA.hindi.trendTerms)}`,
    
    hebrew: (sound: SoundSEOMetadata) => 
      `צליל תגובה ${getRandomItem(LANGUAGE_SEO_DATA.hebrew.emotions)} מושלם! "${sound.name}" לוכד בדיוק את התחושה הזו כאשר ${getRandomItem(['מישהו מפתיע אותך', 'אתה רואה משהו מזעזע', 'קורה משהו בלתי צפוי', 'אתה לא מאמין למראה עיניך'])}. ${sound.length} שניות של אנרגיית ${getRandomItem(LANGUAGE_SEO_DATA.hebrew.emotions)} טהורה! #תגובה #${sound.hashtags?.[0] || 'מם'} #${getRandomItem(LANGUAGE_SEO_DATA.hebrew.trendTerms)}`
  },
  
  background: {
    english: (sound: SoundSEOMetadata) => 
      `Add "${sound.name}" as your video background sound 🎵 Perfect ${sound.length}s audio for ${getRandomItem(['storytimes', 'vlogs', 'tutorials', 'reviews', 'gaming videos'])} on ${getRandomItem(LANGUAGE_SEO_DATA.english.platforms)}. Creates a ${getRandomItem(LANGUAGE_SEO_DATA.english.emotions)} atmosphere for your content. #backgroundaudio #${getRandomItem(LANGUAGE_SEO_DATA.english.trendTerms)} #${sound.hashtags?.[0] || 'sound'}`,
    
    spanish: (sound: SoundSEOMetadata) => 
      `Añade "${sound.name}" como sonido de fondo para tus videos 🎵 Audio perfecto de ${sound.length} segundos para ${getRandomItem(['historias', 'vlogs', 'tutoriales', 'reseñas', 'videos de juegos'])} en ${getRandomItem(LANGUAGE_SEO_DATA.spanish.platforms)}. Crea un ambiente ${getRandomItem(LANGUAGE_SEO_DATA.spanish.emotions)} para tu contenido. #audiofondo #${getRandomItem(LANGUAGE_SEO_DATA.spanish.trendTerms)} #${sound.hashtags?.[0] || 'sonido'}`,
    
    portuguese: (sound: SoundSEOMetadata) => 
      `Adicione "${sound.name}" como som de fundo para seus vídeos 🎵 Áudio perfeito de ${sound.length} segundos para ${getRandomItem(['histórias', 'vlogs', 'tutoriais', 'resenhas', 'vídeos de jogos'])} no ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.platforms)}. Cria uma atmosfera ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.emotions)} para seu conteúdo. #somdefundo #${getRandomItem(LANGUAGE_SEO_DATA.portuguese.trendTerms)} #${sound.hashtags?.[0] || 'som'}`,
    
    german: (sound: SoundSEOMetadata) => 
      `Füge "${sound.name}" als Hintergrundton für deine Videos hinzu 🎵 Perfektes ${sound.length}s Audio für ${getRandomItem(['Storytime', 'Vlogs', 'Tutorials', 'Reviews', 'Gaming-Videos'])} auf ${getRandomItem(LANGUAGE_SEO_DATA.german.platforms)}. Schafft eine ${getRandomItem(LANGUAGE_SEO_DATA.german.emotions)} Atmosphäre für deinen Content. #hintergrundmusik #${getRandomItem(LANGUAGE_SEO_DATA.german.trendTerms)} #${sound.hashtags?.[0] || 'sound'}`,
    
    russian: (sound: SoundSEOMetadata) => 
      `Добавь "${sound.name}" как фоновый звук для своих видео 🎵 Идеальное ${sound.length}-секундное аудио для ${getRandomItem(['сторитаймов', 'влогов', 'туториалов', 'обзоров', 'игровых видео'])} на ${getRandomItem(LANGUAGE_SEO_DATA.russian.platforms)}. Создает ${getRandomItem(LANGUAGE_SEO_DATA.russian.emotions)} атмосферу для твоего контента. #фоновыйзвук #${getRandomItem(LANGUAGE_SEO_DATA.russian.trendTerms)} #${sound.hashtags?.[0] || 'звук'}`,
    
    arabic: (sound: SoundSEOMetadata) => 
      `أضف "${sound.name}" كصوت خلفية لفيديوهاتك 🎵 صوت مثالي لمدة ${sound.length} ثانية لـ ${getRandomItem(['القصص', 'الفلوغات', 'الشروحات', 'المراجعات', 'فيديوهات الألعاب'])} على ${getRandomItem(LANGUAGE_SEO_DATA.arabic.platforms)}. يخلق جواً ${getRandomItem(LANGUAGE_SEO_DATA.arabic.emotions)} لمحتواك. #صوت_خلفية #${getRandomItem(LANGUAGE_SEO_DATA.arabic.trendTerms)} #${sound.hashtags?.[0] || 'صوت'}`,
    
    japanese: (sound: SoundSEOMetadata) => 
      `"${sound.name}"をあなたの動画のバックグラウンドサウンドとして追加しましょう 🎵 ${getRandomItem(LANGUAGE_SEO_DATA.japanese.platforms)}での${getRandomItem(['ストーリータイム', 'ブログ', 'チュートリアル', 'レビュー', 'ゲーム動画'])}に最適な${sound.length}秒のオーディオです。コンテンツに${getRandomItem(LANGUAGE_SEO_DATA.japanese.emotions)}雰囲気を作り出します。#バックグラウンドオーディオ #${getRandomItem(LANGUAGE_SEO_DATA.japanese.trendTerms)} #${sound.hashtags?.[0] || 'サウンド'}`,
    
    korean: (sound: SoundSEOMetadata) => 
      `"${sound.name}"을(를) 비디오의 배경 사운드로 추가하세요 🎵 ${getRandomItem(LANGUAGE_SEO_DATA.korean.platforms)}에서 ${getRandomItem(['스토리타임', '브이로그', '튜토리얼', '리뷰', '게임 비디오'])}에 완벽한 ${sound.length}초 오디오입니다. 컨텐츠에 ${getRandomItem(LANGUAGE_SEO_DATA.korean.emotions)} 분위기를 만듭니다. #배경오디오 #${getRandomItem(LANGUAGE_SEO_DATA.korean.trendTerms)} #${sound.hashtags?.[0] || '사운드'}`,
    
    vietnamese: (sound: SoundSEOMetadata) => 
      `Thêm "${sound.name}" làm âm thanh nền cho video của bạn 🎵 Âm thanh ${sound.length}s hoàn hảo cho ${getRandomItem(['kể chuyện', 'vlog', 'hướng dẫn', 'đánh giá', 'video game'])} trên ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.platforms)}. Tạo bầu không khí ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.emotions)} cho nội dung của bạn. #amthanhnen #${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.trendTerms)} #${sound.hashtags?.[0] || 'amthanh'}`,
    
    chinese: (sound: SoundSEOMetadata) => 
      `将"${sound.name}"添加为您视频的背景声音 🎵 适合在${getRandomItem(LANGUAGE_SEO_DATA.chinese.platforms)}上${getRandomItem(['讲故事', '日常记录', '教程', '评测', '游戏视频'])}的完美${sound.length}秒音频。为您的内容创造${getRandomItem(LANGUAGE_SEO_DATA.chinese.emotions)}氛围。#背景音频 #${getRandomItem(LANGUAGE_SEO_DATA.chinese.trendTerms)} #${sound.hashtags?.[0] || '声音'}`,
    
    french: (sound: SoundSEOMetadata) => 
      `Ajoutez "${sound.name}" comme son de fond pour vos vidéos 🎵 Audio parfait de ${sound.length}s pour ${getRandomItem(['storytimes', 'vlogs', 'tutoriels', 'critiques', 'vidéos de jeu'])} sur ${getRandomItem(LANGUAGE_SEO_DATA.french.platforms)}. Crée une ambiance ${getRandomItem(LANGUAGE_SEO_DATA.french.emotions)} pour votre contenu. #sondefond #${getRandomItem(LANGUAGE_SEO_DATA.french.trendTerms)} #${sound.hashtags?.[0] || 'son'}`,
    
    italian: (sound: SoundSEOMetadata) => 
      `Aggiungi "${sound.name}" come suono di sottofondo per i tuoi video 🎵 Audio perfetto di ${sound.length}s per ${getRandomItem(['racconti', 'vlog', 'tutorial', 'recensioni', 'video di gaming'])} su ${getRandomItem(LANGUAGE_SEO_DATA.italian.platforms)}. Crea un'atmosfera ${getRandomItem(LANGUAGE_SEO_DATA.italian.emotions)} per i tuoi contenuti. #audiodisottofondo #${getRandomItem(LANGUAGE_SEO_DATA.italian.trendTerms)} #${sound.hashtags?.[0] || 'suono'}`,
    
    turkish: (sound: SoundSEOMetadata) => 
      `"${sound.name}"i videolarınızın arka plan sesi olarak ekleyin 🎵 ${getRandomItem(LANGUAGE_SEO_DATA.turkish.platforms)} üzerindeki ${getRandomItem(['hikayelerin', 'vlogların', 'eğitimlerin', 'incelemelerin', 'oyun videolarının'])} için mükemmel ${sound.length}s ses. İçeriğiniz için ${getRandomItem(LANGUAGE_SEO_DATA.turkish.emotions)} bir atmosfer yaratır. #arkaplanses #${getRandomItem(LANGUAGE_SEO_DATA.turkish.trendTerms)} #${sound.hashtags?.[0] || 'ses'}`,
    
    hindi: (sound: SoundSEOMetadata) => 
      `"${sound.name}" को अपने वीडियो के बैकग्राउंड साउंड के रूप में जोड़ें 🎵 ${getRandomItem(LANGUAGE_SEO_DATA.hindi.platforms)} पर ${getRandomItem(['कहानियों', 'व्लॉग', 'ट्यूटोरियल', 'समीक्षाओं', 'गेमिंग वीडियो'])} के लिए परफेक्ट ${sound.length}s ऑडियो। आपकी कंटेंट के लिए ${getRandomItem(LANGUAGE_SEO_DATA.hindi.emotions)} माहौल बनाता है। #बैकग्राउंडऑडियो #${getRandomItem(LANGUAGE_SEO_DATA.hindi.trendTerms)} #${sound.hashtags?.[0] || 'साउंड'}`,
    
    hebrew: (sound: SoundSEOMetadata) => 
      `הוסף את "${sound.name}" כצליל רקע לסרטונים שלך 🎵 אודיו מושלם של ${sound.length} שניות עבור ${getRandomItem(['סיפורים', 'ולוגים', 'הדרכות', 'סקירות', 'סרטוני משחקים'])} ב-${getRandomItem(LANGUAGE_SEO_DATA.hebrew.platforms)}. יוצר אווירה ${getRandomItem(LANGUAGE_SEO_DATA.hebrew.emotions)} לתוכן שלך. #צלילרקע #${getRandomItem(LANGUAGE_SEO_DATA.hebrew.trendTerms)} #${sound.hashtags?.[0] || 'צליל'}`
  },
  
  effect: {
    english: (sound: SoundSEOMetadata) => 
      `Transform your videos with the "${sound.name}" sound effect 💥 This ${sound.length}s audio effect adds ${getRandomItem(['drama', 'comedy', 'excitement', 'mystery', 'intensity'])} to your ${getRandomItem(LANGUAGE_SEO_DATA.english.platforms)} content. Perfect for transitions and ${getRandomItem(['reveals', 'pranks', 'challenges', 'transformations'])}. #soundeffect #${getRandomItem(LANGUAGE_SEO_DATA.english.trendTerms)} #${sound.hashtags?.[0] || 'effect'}`,
    
    spanish: (sound: SoundSEOMetadata) => 
      `Transforma tus videos con el efecto de sonido "${sound.name}" 💥 Este efecto de audio de ${sound.length} segundos añade ${getRandomItem(['drama', 'comedia', 'emoción', 'misterio', 'intensidad'])} a tu contenido de ${getRandomItem(LANGUAGE_SEO_DATA.spanish.platforms)}. Perfecto para transiciones y ${getRandomItem(['revelaciones', 'bromas', 'desafíos', 'transformaciones'])}. #efectosonido #${getRandomItem(LANGUAGE_SEO_DATA.spanish.trendTerms)} #${sound.hashtags?.[0] || 'efecto'}`,
    
    portuguese: (sound: SoundSEOMetadata) => 
      `Transforme seus vídeos com o efeito sonoro "${sound.name}" 💥 Este efeito de áudio de ${sound.length} segundos adiciona ${getRandomItem(['drama', 'comédia', 'emoção', 'mistério', 'intensidade'])} ao seu conteúdo do ${getRandomItem(LANGUAGE_SEO_DATA.portuguese.platforms)}. Perfeito para transições e ${getRandomItem(['revelações', 'pegadinhas', 'desafios', 'transformações'])}. #efeitosonoro #${getRandomItem(LANGUAGE_SEO_DATA.portuguese.trendTerms)} #${sound.hashtags?.[0] || 'efeito'}`,
    
    german: (sound: SoundSEOMetadata) => 
      `Transformiere deine Videos mit dem "${sound.name}" Soundeffekt 💥 Dieser ${sound.length}s Audioeffekt fügt deinem ${getRandomItem(LANGUAGE_SEO_DATA.german.platforms)}-Content ${getRandomItem(['Drama', 'Komik', 'Spannung', 'Mystik', 'Intensität'])} hinzu. Perfekt für Übergänge und ${getRandomItem(['Enthüllungen', 'Streiche', 'Challenges', 'Verwandlungen'])}. #soundeffekt #${getRandomItem(LANGUAGE_SEO_DATA.german.trendTerms)} #${sound.hashtags?.[0] || 'effekt'}`,
    
    russian: (sound: SoundSEOMetadata) => 
      `Преобрази свои видео со звуковым эффектом "${sound.name}" 💥 Этот ${sound.length}-секундный аудиоэффект добавляет ${getRandomItem(['драмы', 'комедии', 'возбуждения', 'таинственности', 'интенсивности'])} твоему контенту на ${getRandomItem(LANGUAGE_SEO_DATA.russian.platforms)}. Идеально для переходов и ${getRandomItem(['раскрытий', 'пранков', 'челленджей', 'трансформаций'])}. #звуковойэффект #${getRandomItem(LANGUAGE_SEO_DATA.russian.trendTerms)} #${sound.hashtags?.[0] || 'эффект'}`,
    
    arabic: (sound: SoundSEOMetadata) => 
      `حوّل فيديوهاتك باستخدام مؤثر صوتي "${sound.name}" 💥 يضيف هذا المؤثر الصوتي البالغ ${sound.length} ثانية ${getRandomItem(['دراما', 'كوميديا', 'إثارة', 'غموض', 'حدة'])} إلى محتواك على ${getRandomItem(LANGUAGE_SEO_DATA.arabic.platforms)}. مثالي للانتقالات و${getRandomItem(['المفاجآت', 'المقالب', 'التحديات', 'التحولات'])}. #مؤثر_صوتي #${getRandomItem(LANGUAGE_SEO_DATA.arabic.trendTerms)} #${sound.hashtags?.[0] || 'تأثير'}`,
    
    japanese: (sound: SoundSEOMetadata) => 
      `"${sound.name}"サウンドエフェクトであなたの動画を変身させよう 💥 この${sound.length}秒の音響効果は、${getRandomItem(LANGUAGE_SEO_DATA.japanese.platforms)}コンテンツに${getRandomItem(['ドラマ性', 'コメディ感', 'ワクワク感', '神秘性', '迫力'])}を加えます。トランジションや${getRandomItem(['発表', 'いたずら', 'チャレンジ', '変身'])}に最適です。#サウンドエフェクト #${getRandomItem(LANGUAGE_SEO_DATA.japanese.trendTerms)} #${sound.hashtags?.[0] || 'エフェクト'}`,
    
    korean: (sound: SoundSEOMetadata) => 
      `"${sound.name}" 사운드 이펙트로 당신의 비디오를 변화시키세요 💥 이 ${sound.length}초 오디오 이펙트는 ${getRandomItem(LANGUAGE_SEO_DATA.korean.platforms)} 콘텐츠에 ${getRandomItem(['드라마', '코미디', '흥분', '미스터리', '강도'])}를 더합니다. 전환과 ${getRandomItem(['리빌', '장난', '챌린지', '변신'])}에 완벽합니다. #사운드이펙트 #${getRandomItem(LANGUAGE_SEO_DATA.korean.trendTerms)} #${sound.hashtags?.[0] || '이펙트'}`,
    
    vietnamese: (sound: SoundSEOMetadata) => 
      `Biến đổi video của bạn với hiệu ứng âm thanh "${sound.name}" 💥 Hiệu ứng âm thanh ${sound.length}s này thêm ${getRandomItem(['kịch tính', 'hài hước', 'phấn khích', 'bí ẩn', 'cường độ'])} vào nội dung ${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.platforms)} của bạn. Hoàn hảo cho chuyển cảnh và ${getRandomItem(['tiết lộ', 'trò đùa', 'thử thách', 'biến đổi'])}. #hieuungamthanh #${getRandomItem(LANGUAGE_SEO_DATA.vietnamese.trendTerms)} #${sound.hashtags?.[0] || 'hieuung'}`,
    
    chinese: (sound: SoundSEOMetadata) => 
      `用"${sound.name}"音效变换你的视频 💥 这个${sound.length}秒的音效为你的${getRandomItem(LANGUAGE_SEO_DATA.chinese.platforms)}内容增添${getRandomItem(['戏剧性', '喜剧感', '兴奋感', '神秘感', '强度'])}。非常适合转场和${getRandomItem(['揭示', '恶作剧', '挑战', '变身'])}。#音效 #${getRandomItem(LANGUAGE_SEO_DATA.chinese.trendTerms)} #${sound.hashtags?.[0] || '效果'}`,
    
    french: (sound: SoundSEOMetadata) => 
      `Transformez vos vidéos avec l'effet sonore "${sound.name}" 💥 Cet effet audio de ${sound.length}s ajoute du ${getRandomItem(['drame', 'comique', 'suspense', 'mystère', 'intensité'])} à votre contenu ${getRandomItem(LANGUAGE_SEO_DATA.french.platforms)}. Parfait pour les transitions et ${getRandomItem(['révélations', 'pranks', 'défis', 'transformations'])}. #effetsonore #${getRandomItem(LANGUAGE_SEO_DATA.french.trendTerms)} #${sound.hashtags?.[0] || 'effet'}`,
    
    italian: (sound: SoundSEOMetadata) => 
      `Trasforma i tuoi video con l'effetto sonoro "${sound.name}" 💥 Questo effetto audio di ${sound.length}s aggiunge ${getRandomItem(['drammaticità', 'comicità', 'eccitazione', 'mistero', 'intensità'])} ai tuoi contenuti ${getRandomItem(LANGUAGE_SEO_DATA.italian.platforms)}. Perfetto per transizioni e ${getRandomItem(['rivelazioni', 'scherzi', 'sfide', 'trasformazioni'])}. #effettosonoro #${getRandomItem(LANGUAGE_SEO_DATA.italian.trendTerms)} #${sound.hashtags?.[0] || 'effetto'}`,
    
    turkish: (sound: SoundSEOMetadata) => 
      `Videolarınızı "${sound.name}" ses efekti ile dönüştürün 💥 Bu ${sound.length}s ses efekti, ${getRandomItem(LANGUAGE_SEO_DATA.turkish.platforms)} içeriğinize ${getRandomItem(['drama', 'komedi', 'heyecan', 'gizem', 'yoğunluk'])} katar. Geçişler ve ${getRandomItem(['açıklamalar', 'şakalar', 'meydan okumalar', 'dönüşümler'])} için mükemmel. #sesiefekti #${getRandomItem(LANGUAGE_SEO_DATA.turkish.trendTerms)} #${sound.hashtags?.[0] || 'efekt'}`,
    
    hindi: (sound: SoundSEOMetadata) => 
      `"${sound.name}" साउंड इफेक्ट के साथ अपने वीडियो को ट्रांसफॉर्म करें 💥 यह ${sound.length}s ऑडियो इफेक्ट आपके ${getRandomItem(LANGUAGE_SEO_DATA.hindi.platforms)} कंटेंट में ${getRandomItem(['ड्रामा', 'कॉमेडी', 'उत्साह', 'रहस्य', 'तीव्रता'])} जोड़ता है। ट्रांजिशन और ${getRandomItem(['रिवील्स', 'प्रैंक्स', 'चैलेंजेस', 'ट्रांसफॉर्मेशन'])} के लिए एकदम सही। #साउंडइफेक्ट #${getRandomItem(LANGUAGE_SEO_DATA.hindi.trendTerms)} #${sound.hashtags?.[0] || 'इफेक्ट'}`,
    
    hebrew: (sound: SoundSEOMetadata) => 
      `שנה את הסרטונים שלך עם אפקט הצליל "${sound.name}" 💥 אפקט האודיו הזה של ${sound.length} שניות מוסיף ${getRandomItem(['דרמה', 'קומדיה', 'התרגשות', 'מסתורין', 'עוצמה'])} לתוכן שלך ב-${getRandomItem(LANGUAGE_SEO_DATA.hebrew.platforms)}. מושלם למעברים ו${getRandomItem(['חשיפות', 'מתיחות', 'אתגרים', 'טרנספורמציות'])}. #אפקטצליל #${getRandomItem(LANGUAGE_SEO_DATA.hebrew.trendTerms)} #${sound.hashtags?.[0] || 'אפקט'}`
  }
};

/**
 * Gets a localized description optimized for SEO based on language and sound metadata
 */
export function getLocalizedDescription(sound: SoundSEOMetadata, language: string): string {
  // Default to English if language not supported
  const normalizedLanguage = language.toLowerCase();
  const languageData = LANGUAGE_SEO_DATA[normalizedLanguage] || LANGUAGE_SEO_DATA.english;
  
  // Determine what type of sound this is based on its properties
  const contentType = determineContentType(sound);
  
  // Get templates for this content type
  const templates = descriptionTemplates[contentType];
  const template = templates[normalizedLanguage] || templates.english;
  
  // Generate the base description
  let description = template(sound);
  
  // Enhance with regional keywords if available
  description = enhanceWithRegionalKeywords(description, languageData);
  
  return description;
}

/**
 * Generates structured data for a sound based on language and metadata
 */
export function generateSoundStructuredData(sound: SoundSEOMetadata, language: string) {
  const normalizedLanguage = language.toLowerCase();
  const languageData = LANGUAGE_SEO_DATA[normalizedLanguage] || LANGUAGE_SEO_DATA.english;
  
  return {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    "name": sound.name,
    "description": getLocalizedDescription(sound, language),
    "contentUrl": `https://brainrot-memes.com/${language}/memesound/${sound.id}`,
    "encodingFormat": "audio/mpeg",
    "duration": `PT${sound.length || 0}S`,
    "inLanguage": languageData.locale.split('_')[0],
    "keywords": generateKeywords(sound, language),
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/ListenAction",
      "userInteractionCount": sound.viralityIndex || 100
    },
    "potentialAction": {
      "@type": "PlayAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://brainrot-memes.com/${language}/memesound/${sound.id}`
      }
    }
  };
}

/**
 * Generates specific meta tags for a sound based on language and metadata
 */
export function generateMetaTags(sound: SoundSEOMetadata, language: string) {
  const normalizedLanguage = language.toLowerCase();
  const languageData = LANGUAGE_SEO_DATA[normalizedLanguage] || LANGUAGE_SEO_DATA.english;
  const description = getLocalizedDescription(sound, language);
  const keywords = generateKeywords(sound, language);
  
  return {
    title: `${sound.name} | Brainrot Memes - ${getRandomItem(languageData.emotions)} ${getRandomItem(languageData.viralTerms)} sound`,
    description,
    keywords: keywords.join(', '),
    ogTitle: `${sound.name} - ${getRandomItem(languageData.viralTerms)} ${getRandomItem(languageData.platforms)} sound | Brainrot Memes`,
    ogDescription: description,
    twitterTitle: `🔊 ${sound.name} | ${getRandomItem(languageData.viralTerms)} ${getRandomItem(languageData.platforms)} Sound`,
    twitterDescription: description.substring(0, 200),
    locale: languageData.locale,
    alternateLocales: Object.values(LANGUAGE_SEO_DATA).map(data => data.locale)
  };
}

/**
 * Generates a list of hreflang tags for all supported languages
 */
export function generateHreflangTags(sound: SoundSEOMetadata) {
  return Object.entries(LANGUAGE_SEO_DATA).map(([lang, data]) => ({
    hreflang: data.locale.split('_')[0],
    href: `https://brainrot-memes.com/${lang}/memesound/${sound.id}`
  }));
}

/**
 * Determines content type based on sound metadata
 */
function determineContentType(sound: SoundSEOMetadata): SoundContentType {
  if (sound.contentType) return sound.contentType;
  
  // If no content type is specified, try to determine from other properties
  if (sound.viralityIndex && sound.viralityIndex > 80) return 'viral';
  if (sound.hashtags?.includes('meme') || sound.hashtags?.includes('funny')) return 'meme';
  if (sound.hashtags?.includes('reaction')) return 'reaction';
  if (sound.hashtags?.includes('effect')) return 'effect';
  
  // Default to meme if we can't determine
  return 'meme';
}

/**
 * Enhances a description with regional keywords
 */
function enhanceWithRegionalKeywords(description: string, languageData: any): string {
  // Add regional keywords if they're not already in the description
  const regionalTerms = [
    getRandomItem(languageData.regionNames),
    getRandomItem(languageData.platforms),
    getRandomItem(languageData.trendTerms)
  ];
  
  let enhanced = description;
  regionalTerms.forEach(term => {
    if (term && typeof term === 'string' && !description.includes(term)) {
      enhanced = enhanced.replace(/\.$/, ` ${term}.`);
    }
  });
  
  return enhanced;
}

/**
 * Generates keywords for a sound based on language and metadata
 */
function generateKeywords(sound: SoundSEOMetadata, language: string): string[] {
  const normalizedLanguage = language.toLowerCase();
  const languageData = LANGUAGE_SEO_DATA[normalizedLanguage] || LANGUAGE_SEO_DATA.english;
  
  const baseKeywords = [
    sound.name,
    'brainrot',
    'meme sound',
    'viral audio',
    'sound effect',
    ...languageData.viralTerms,
    ...languageData.platforms,
    getRandomItem(languageData.emotions),
    getRandomItem(languageData.culturalReferences),
    getRandomItem(languageData.audienceTerms)
  ];
  
  // Add hashtags if available
  if (sound.hashtags && sound.hashtags.length > 0) {
    baseKeywords.push(...sound.hashtags);
  }
  
  // Add year if available
  if (sound.year) {
    baseKeywords.push(`${sound.year} meme`, `${sound.year} sound`, `${sound.year} viral`);
  }
  
  // Add trending terms
  baseKeywords.push(...languageData.trendTerms);
  
  // Return unique keywords
  return Array.from(new Set(baseKeywords));
}

/**
 * Gets a random item from an array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates hreflang XML for sitemap
 */
export function generateHreflangXml(sound: SoundSEOMetadata): string {
  let xml = '';
  
  Object.entries(LANGUAGE_SEO_DATA).forEach(([lang, data]) => {
    xml += `<xhtml:link rel="alternate" hreflang="${data.locale.split('_')[0]}" `;
    xml += `href="https://brainrot-memes.com/${lang}/memesound/${sound.id}" />\n`;
  });
  
  // Add x-default
  xml += `<xhtml:link rel="alternate" hreflang="x-default" `;
  xml += `href="https://brainrot-memes.com/english/memesound/${sound.id}" />`;
  
  return xml;
}

/**
 * Gets engagement prompts in the specified language to encourage user interaction
 */
export function getEngagementPrompts(language: string): string[] {
  const normalizedLanguage = language.toLowerCase();
  const languageData = LANGUAGE_SEO_DATA[normalizedLanguage] || LANGUAGE_SEO_DATA.english;
  
  // Language-specific prompt templates
  const promptTemplates = {
    english: {
      actionSound: (action: string, emotion: string) => `${action} this ${emotion} sound!`,
      reminder: (action: string) => `Don't forget to ${action}!`,
      description: (emotion: string) => `This sound is ${emotion}!`,
      platform: (platform: string) => `Perfect for ${platform}!`
    },
    spanish: {
      actionSound: (action: string, emotion: string) => `¡${action} este sonido ${emotion}!`,
      reminder: (action: string) => `¡No olvides ${action}!`,
      description: (emotion: string) => `¡Este sonido es ${emotion}!`,
      platform: (platform: string) => `¡Perfecto para ${platform}!`
    },
    portuguese: {
      actionSound: (action: string, emotion: string) => `${action} este som ${emotion}!`,
      reminder: (action: string) => `Não se esqueça de ${action}!`,
      description: (emotion: string) => `Este som é ${emotion}!`,
      platform: (platform: string) => `Perfeito para ${platform}!`
    },
    german: {
      actionSound: (action: string, emotion: string) => `${action} diesen ${emotion} Sound!`,
      reminder: (action: string) => `Vergiss nicht zu ${action}!`,
      description: (emotion: string) => `Dieser Sound ist ${emotion}!`,
      platform: (platform: string) => `Perfekt für ${platform}!`
    },
    russian: {
      actionSound: (action: string, emotion: string) => `${action} этот ${emotion} звук!`,
      reminder: (action: string) => `Не забудь ${action}!`,
      description: (emotion: string) => `Этот звук ${emotion}!`,
      platform: (platform: string) => `Идеально для ${platform}!`
    },
    arabic: {
      actionSound: (action: string, emotion: string) => `${action} هذا الصوت ${emotion}!`,
      reminder: (action: string) => `لا تنسى أن ${action}!`,
      description: (emotion: string) => `هذا الصوت ${emotion}!`,
      platform: (platform: string) => `مثالي لـ ${platform}!`
    },
    japanese: {
      actionSound: (action: string, emotion: string) => `この${emotion}サウンドを${action}しよう！`,
      reminder: (action: string) => `${action}するのを忘れないでください！`,
      description: (emotion: string) => `このサウンドは${emotion}です！`,
      platform: (platform: string) => `${platform}に最適です！`
    },
    korean: {
      actionSound: (action: string, emotion: string) => `이 ${emotion} 사운드를 ${action}하세요!`,
      reminder: (action: string) => `${action}하는 것을 잊지 마세요!`,
      description: (emotion: string) => `이 사운드는 ${emotion}합니다!`,
      platform: (platform: string) => `${platform}에 완벽합니다!`
    },
    vietnamese: {
      actionSound: (action: string, emotion: string) => `Hãy ${action} âm thanh ${emotion} này!`,
      reminder: (action: string) => `Đừng quên ${action}!`,
      description: (emotion: string) => `Âm thanh này thật ${emotion}!`,
      platform: (platform: string) => `Hoàn hảo cho ${platform}!`
    },
    chinese: {
      actionSound: (action: string, emotion: string) => `${action}这个${emotion}的声音！`,
      reminder: (action: string) => `别忘了${action}！`,
      description: (emotion: string) => `这个声音很${emotion}！`,
      platform: (platform: string) => `非常适合${platform}！`
    },
    french: {
      actionSound: (action: string, emotion: string) => `${action} ce son ${emotion} !`,
      reminder: (action: string) => `N'oubliez pas de ${action} !`,
      description: (emotion: string) => `Ce son est ${emotion} !`,
      platform: (platform: string) => `Parfait pour ${platform} !`
    },
    italian: {
      actionSound: (action: string, emotion: string) => `${action} questo suono ${emotion}!`,
      reminder: (action: string) => `Non dimenticare di ${action}!`,
      description: (emotion: string) => `Questo suono è ${emotion}!`,
      platform: (platform: string) => `Perfetto per ${platform}!`
    },
    turkish: {
      actionSound: (action: string, emotion: string) => `Bu ${emotion} sesi ${action}!`,
      reminder: (action: string) => `${action} unutma!`,
      description: (emotion: string) => `Bu ses ${emotion}!`,
      platform: (platform: string) => `${platform} için mükemmel!`
    },
    hindi: {
      actionSound: (action: string, emotion: string) => `इस ${emotion} साउंड को ${action}!`,
      reminder: (action: string) => `${action} करना न भूलें!`,
      description: (emotion: string) => `यह साउंड ${emotion} है!`,
      platform: (platform: string) => `${platform} के लिए एकदम सही!`
    },
    hebrew: {
      actionSound: (action: string, emotion: string) => `${action} את הצליל ה${emotion} הזה!`,
      reminder: (action: string) => `אל תשכח ל${action}!`,
      description: (emotion: string) => `הצליל הזה ${emotion}!`,
      platform: (platform: string) => `מושלם עבור ${platform}!`
    }
  };
  
  // Get template for requested language or fallback to English
  const templates = promptTemplates[normalizedLanguage] || promptTemplates.english;
  const actions = languageData.userActions || LANGUAGE_SEO_DATA.english.userActions;
  const emotions = languageData.emotions || LANGUAGE_SEO_DATA.english.emotions;
  const platforms = languageData.platforms || LANGUAGE_SEO_DATA.english.platforms;
  
  return [
    templates.actionSound(getRandomItem(actions), getRandomItem(emotions)),
    templates.reminder(getRandomItem(actions)),
    templates.description(getRandomItem(emotions)),
    templates.platform(getRandomItem(platforms))
  ];
}

/**
 * Generates an SEO-friendly URL slug for a sound
 */
export function generateSeoSlug(sound: SoundSEOMetadata, language: string): string {
  const normalizedLanguage = language.toLowerCase();
  const base = sound.name.toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Remove consecutive hyphens
    
  // Add language-specific trend term if space allows
  if (base.length < 30) {
    const langData = LANGUAGE_SEO_DATA[normalizedLanguage] || LANGUAGE_SEO_DATA.english;
    const trendTerm = getRandomItem(langData.trendTerms as string[])
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
      
    return `${base}-${trendTerm}`;
  }
  
  return base;
}

