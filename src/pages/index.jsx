import Layout from './Layout.jsx';
import Sounds from './Sounds';
import Leaderboard from './Leaderboard';
import MemeSound from './MemeSound';
import SavedSounds from './SavedSounds';
import PolicyPage from './Policy';
import BlogList from '../components/blog/BlogList.jsx';
import BlogPost from '../components/blog/BlogPost.jsx';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  useParams,
  useNavigate,
} from 'react-router-dom';
import { useEffect } from 'react';

export const SUPPORTED_LANGUAGES = [
  { code: 'English', flag: '🇬🇧' },
  { code: 'Portuguese', flag: '🇵🇹' },
  { code: 'Spanish', flag: '🇪🇸' },
  { code: 'German', flag: '🇩🇪' },
  { code: 'Russian', flag: '🇷🇺' },
  { code: 'Arabic', flag: '🇸🇦' },
  { code: 'Japanese', flag: '🇯🇵' },
  { code: 'Korean', flag: '🇰🇷' },
  { code: 'Vietnamese', flag: '🇻🇳' },
  { code: 'Chinese', flag: '🇨🇳' },
  { code: 'French', flag: '🇫🇷' },
  { code: 'Italian', flag: '🇮🇹' },
  { code: 'Turkish', flag: '🇹🇷' },
  { code: 'Hindi', flag: '🇮🇳' },
  { code: 'Hebrew', flag: '🇮🇱' },
];

export const DEFAULT_LANGUAGE = 'English';

const PAGES = {
  Sounds: Sounds,
  Leaderboard: Leaderboard,
  MemeSound: MemeSound,
  SavedSounds: SavedSounds,
  Blog: BlogList,
};

/**
 * Redirects to language-specific URLs with parameters
 */
function LanguageRedirectWithParam({ paramName, redirectPath }) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  
  useEffect(() => {
    const userLanguage = localStorage.getItem('selected_language') || DEFAULT_LANGUAGE;
    const paramValue = params[paramName];
    
    // Special case for blog - keep it non-language specific
    if (redirectPath === 'blog') {
      navigate(`/blog/${paramValue}${location.search}`);
      return;
    }
    
    if (paramValue) {
      // Create URL with parameter
      navigate(`/${userLanguage.toLowerCase()}/${redirectPath}/${paramValue}${location.search}`);
    } else {
      // Create URL without parameter
      navigate(`/${userLanguage.toLowerCase()}/${redirectPath}${location.search}`);
    }
  }, [navigate, redirectPath, paramName, params, location.search]);
  
  return null;
}

/**
 * Determines the current page based on the URL
 */
function _getCurrentPage(url) {
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  // Extract the last part of the URL, ignoring language prefix
  const parts = url.split('/').filter((part) => part);

  // Special handling for blog routes, which are non-language specific
  if (parts[0] === 'blog') {
    return 'Blog';
  }
  
  // Check if the first part is a language - explicit object handling
  const firstPartLower = parts[0]?.toLowerCase();
  const isFirstPartLanguage = SUPPORTED_LANGUAGES.some(
    (lang) => lang.code.toLowerCase() === firstPartLower
  );

  // If first part is a language, use the second part as the page name
  // Otherwise, use the first part
  let urlLastPart =
    isFirstPartLanguage && parts.length > 1 ? parts[1] : parts[0] || '';

  if (urlLastPart?.includes('?')) {
    urlLastPart = urlLastPart.split('?')[0];
  }

  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  return pageName || Object.keys(PAGES)[0];
}

/**
 * Component to handle redirecting to language-specific routes
 */
function LanguageRedirect({ pathSuffix = '' }) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    const userLanguage = localStorage.getItem('selected_language') || DEFAULT_LANGUAGE;
    console.log(`LanguageRedirect: Redirecting with language ${userLanguage}`);

    // Special case for blog - keep it non-language specific
    if (pathSuffix === 'blog') {
      navigate(`/blog${location.search}`);
      return;
    }

    // If there's a sound_id parameter in the URL, preserve it
    if (params.sound_id) {
      navigate(
        `/${userLanguage.toLowerCase()}/memesound/${params.sound_id}${
          location.search
        }`
      );
    } else {
      const path = pathSuffix
        ? `/${userLanguage.toLowerCase()}/${pathSuffix}`
        : `/${userLanguage.toLowerCase()}`;

      // Preserve query parameters
      navigate(`${path}${location.search}`, { replace: true });
    }
  }, [navigate, pathSuffix, params, location.search]);

  return null;
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Helmet>
        <title>{currentPage} | Brainrot Memes</title>
        <meta
          name='description'
          content='Discover and share viral meme sounds, audio clips and soundboard effects.'
        />
        <meta property='og:title' content={`${currentPage} | Brainrot Memes`} />
      </Helmet>
      <Routes>
        {/* Root redirect */}
        <Route path='/' element={<LanguageRedirect />} exact />

        {/* Language-specific routes */}
        <Route path='/:language' element={<Sounds />} exact />
        <Route path='/:language/sounds' element={<Sounds />} />
        <Route path='/:language/leaderboard' element={<Leaderboard />} />
        <Route path='/:language/savedsounds' element={<SavedSounds />} />
        <Route path='/:language/memesound' element={<MemeSound />} />
        <Route path='/:language/memesound/:sound_id' element={<MemeSound />} />

        {/* Legacy routes for backward compatibility */}
        <Route path='/sounds' element={<LanguageRedirect pathSuffix='sounds' />} />
        <Route path='/leaderboard' element={<LanguageRedirect pathSuffix='leaderboard' />} />
        <Route path='/savedsounds' element={<LanguageRedirect pathSuffix='savedsounds' />} />
        <Route path='/memesound' element={<LanguageRedirect pathSuffix='memesound' />} />
        <Route path='/memesound/:sound_id' element={
          <LanguageRedirectWithParam paramName='sound_id' redirectPath='memesound' />
        } />
        
        {/* Direct blog routes - no language prefix */}
        <Route path='/blog' element={<BlogList />} />
        <Route path='/blog/:slug' element={<BlogPost />} />

        {/* Policy pages */}
        <Route path='/privacy-policy' element={<PolicyPage />} />
        <Route path='/terms-of-use' element={<PolicyPage />} />
        <Route path='/disclaimer' element={<PolicyPage />} />
        <Route path='/community-guidelines' element={<PolicyPage />} />

        {/* Catch-all route */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Layout>
  );
}

export default function Pages() {
  return (
    <HelmetProvider>
      <Router>
        <PagesContent />
      </Router>
    </HelmetProvider>
  );
}
