import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added these imports
import { SUPPORTED_LANGUAGES } from "../pages";

// Constants
const PUBLIC_API_URL = 'https://publicmetadata-stbfcg576q-uc.a.run.app';
const AUTH_API_URL = 'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net/getAllSoundsMetadata';

export default function useSoundsData(idToken) {
  const location = useLocation(); // Added this hook
  const navigate = useNavigate(); // Added this hook

  // State variables
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [language, setLanguage] = useState(() => {
    // Standardize on 'selected_language'
    const storedLang = localStorage.getItem('selected_language') || 
                      localStorage.getItem('preferred_language') || 
                      "English";
                      
    // Ensure it's set in the standardized key
    localStorage.setItem('selected_language', storedLang);
    return storedLang;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Refs
  const isMounted = useRef(true);
  const initialized = useRef(false);
  const searchTermRef = useRef(searchTerm);
  const languageRef = useRef(language);
  const isFirstLoad = useRef(true);
  const isUrlChangeRef = useRef(false); // Track URL-triggered changes
  const isManualLanguageChange = useRef(false);
  
  // Update refs when values change
  useEffect(() => { searchTermRef.current = searchTerm; }, [searchTerm]);
  useEffect(() => { languageRef.current = language; }, [language]);
  
  // Main search function - Same as before but with enhanced logging
  async function performSearch(options = {}) {
    // Prevent duplicate requests
    if (loading) {
      console.log("⏳ Already loading, ignoring request");
      return;
    }

    const {
      reset = true,
      lang = languageRef.current,
      term = searchTermRef.current,
      page = reset ? 1 : currentPage,
      forcePublic = isFirstLoad.current
    } = options;
    
    // Set loading state
    setLoading(true);
    
    console.log(`🔍 Searching: language=${lang}, term="${term}", page=${page}, forcePublic=${forcePublic}`);
    
    try {
      // Determine authentication status
      const token = idToken || localStorage.getItem('access_token');
      const hasValidToken = !!(token && token.length > 10);
      const isAuthenticated = hasValidToken && !forcePublic;
      
      // Request body
      const requestBody = {
        language: lang,
        limit: 20,
        page
      };
      
      if (term?.trim()) {
        requestBody.search = term.trim();
      }
      
      // Choose endpoint based on auth status
      const apiEndpoint = isAuthenticated ? AUTH_API_URL : PUBLIC_API_URL;
      
      // Headers
      const headers = { 'Content-Type': 'application/json' };
      
      if (isAuthenticated) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Make request
      console.log(`🚀 Fetching from: ${apiEndpoint}`);
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });
      
      // Check response
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        throw new Error(`Server error: ${response.status}`);
      }
      
      // Parse response
      const data = await response.json();
      if (!data?.result?.success) {
        throw new Error('Invalid API response');
      }
      
      // Get sounds
      const newSounds = data.result.data || [];
      console.log(`✅ Received ${newSounds.length} sounds`);
      
      // Mark anonymous sounds
      if (!isAuthenticated) {
        newSounds.forEach(sound => sound.isAnonymousView = true);
      }
      
      if (isMounted.current) {
        // Update state
        setSounds(prev => reset ? newSounds : [...prev, ...newSounds]);
        setCurrentPage(reset ? 2 : page + 1);
        setHasNextPage(data.result.pagination?.hasNextPage || false);
        setTotalPages(data.result.pagination?.totalPages || 0);
        setTotalItems(data.result.pagination?.totalItems || 0);
        setError(null);
        
        // Update first load flag
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
        }
        
        // Save state
        saveStateToSession(
          reset ? newSounds : [...(reset ? [] : sounds), ...newSounds],
          reset ? 2 : page + 1,
          data.result.pagination,
          lang,
          term
        );
      }
    } catch (err) {
      console.error('🛑 Search error:', err);
      if (isMounted.current) {
        setError(`Could not load sounds: ${err.message}`);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setInitialLoading(false);
      }
    }
  }
  
  // Save state to session storage - unchanged
  function saveStateToSession(soundsList, pageNum, pagination, lang, term) {
    if (!soundsList?.length) return;
    
    try {
      sessionStorage.setItem('sounds_page_state', JSON.stringify({
        sounds: soundsList,
        currentPage: pageNum,
        hasNextPage: pagination?.hasNextPage || false,
        totalPages: pagination?.totalPages || 0,
        totalItems: pagination?.totalItems || 0,
        language: lang,
        searchTerm: term,
        scrollPosition: window.pageYOffset,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error("Error saving state:", e);
    }
  }

  const handleSearchInput = useCallback((value) => {
    console.log(`🔍 Search term updated: "${value}"`);
    setSearchTerm(value);
  }, []);
  
  // Explicit search handler - immediately performs a search
  const handleExplicitSearch = useCallback(() => {
    console.log(`🔎 Explicit search initiated with term: "${searchTermRef.current}"`);
    performSearch({ reset: true, term: searchTermRef.current, lang: languageRef.current });
  }, []);
  
  // Language change handler - Enhanced for URL sync
  const handleLanguageChange = useCallback((newLanguage) => {
    // Skip if no change (prevent unnecessary calls)
    if (!newLanguage || newLanguage === language) return;
    
    console.log(`🚨 Language changed to: ${newLanguage}`);
    
    // 1. Update localStorage FIRST
    localStorage.setItem('selected_language', newLanguage);
    
    // 2. ALWAYS force a data fetch - no conditions at all
    console.log(`🚨 Forcing data fetch for: ${newLanguage}`);
    
    // 3. Set loading state manually to avoid loading checks
    setLoading(true);
    
    // 4. Update language state
    setLanguage(newLanguage);
    
    // 5. Use a direct fetch approach that bypasses all checks
    fetch(PUBLIC_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: newLanguage,
        limit: 20,
        page: 1
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data?.result?.success) {
        // Update sounds array with new language sounds
        setSounds(data.result.data || []);
        setCurrentPage(2);
        setHasNextPage(data.result.pagination?.hasNextPage || false);
        setTotalPages(data.result.pagination?.totalPages || 0);
        setTotalItems(data.result.pagination?.totalItems || 0);
        
        // Save to session
        saveStateToSession(
          data.result.data || [],
          2,
          data.result.pagination,
          newLanguage,
          searchTermRef.current
        );
      }
    })
    .catch(err => console.error("Language fetch error:", err))
    .finally(() => {
      setLoading(false);
      setInitialLoading(false);
      
      // 6. Update URL after data is loaded
      const currentPath = location.pathname;
      const pathParts = currentPath.split('/').filter(Boolean);
      
      // Check if first part is a language
      const firstPartIsLanguage = SUPPORTED_LANGUAGES.some(
        lang => lang.code.toLowerCase() === pathParts[0]?.toLowerCase()
      );
      
      let newPath;
      if (firstPartIsLanguage) {
        // Replace language segment
        pathParts[0] = newLanguage.toLowerCase();
        newPath = '/' + pathParts.join('/');
      } else {
        // Add language segment
        newPath = `/${newLanguage.toLowerCase()}${currentPath === '/' ? '' : currentPath}`;
      }
      
      console.log(`🚨 Updating URL to: ${newPath}${location.search}`);
      navigate(`${newPath}${location.search}`, { replace: true });
    });
    
  }, [navigate, location.pathname, location.search]); 
  
  // ALSO replace the URL detection effect with this simpler one:
  useEffect(() => {
    // Skip if manual change in progress or not initialized
    if (isManualLanguageChange.current || !initialized.current) return;
    
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (!pathParts.length) return;
    
    const urlLanguageLower = pathParts[0].toLowerCase();
    
    // Find matching language from SUPPORTED_LANGUAGES
    const matchedLang = SUPPORTED_LANGUAGES.find(
      lang => lang.code.toLowerCase() === urlLanguageLower
    );
    
    // Only proceed if we found a matching language that differs from current
    if (matchedLang?.code && matchedLang.code !== language) {
      console.log(`🔤 URL language (${matchedLang.code}) differs from current (${language})`);
      
      // Update state WITHOUT triggering navigate
      setLanguage(matchedLang.code);
      localStorage.setItem('selected_language', matchedLang.code);
      
      // Fetch data with new language
      performSearch({ reset: true, lang: matchedLang.code });
    }
  }, [location.pathname, language]);
  
  // Initialize on mount - Updated to use selected_language consistently
  useEffect(() => {
    console.log("🏁 Component mounted - initializing");
    
    const loadInitialData = async () => {
      // Try to restore state from session
      const savedState = sessionStorage.getItem('sounds_page_state');
      
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          
          // Only use recent state (less than 30 min old)
          if (Date.now() - parsedState.timestamp < 30 * 60 * 1000) {
            console.log("✅ Restoring saved state");
            
            // Use selected_language consistently
            const storedLang = localStorage.getItem('selected_language') || 
                              localStorage.getItem('preferred_language') || 
                              "English";
            
            // Ensure it's set in the standard key
            localStorage.setItem('selected_language', storedLang);
            
            // Restore appropriate state
            if (storedLang && parsedState.language === storedLang) {
              setSounds(parsedState.sounds || []);
              setCurrentPage(parsedState.currentPage || 1);
              setHasNextPage(parsedState.hasNextPage || false);
              setTotalPages(parsedState.totalPages || 0);
              setTotalItems(parsedState.totalItems || 0);
            } else {
              console.log("⚠️ Language changed - clearing sounds");
              setSounds([]);
              setCurrentPage(1);
              setHasNextPage(false);
              setTotalPages(0);
              setTotalItems(0);
            }
            
            // Set language and search term
            setLanguage(storedLang);
            languageRef.current = storedLang;
            setSearchTerm(parsedState.searchTerm || "");
            searchTermRef.current = parsedState.searchTerm || "";
            
            initialized.current = true;
            
            // Fetch new data if language changed
            if (storedLang && parsedState.language !== storedLang) {
              console.log("🔄 Language changed, fetching new data");
              performSearch({ reset: true, forcePublic: isFirstLoad.current });
            } else {
              // No need to fetch, already have data
              setInitialLoading(false);
              isFirstLoad.current = false;
            }
            
            return;
          }
        } catch (e) {
          console.error("❌ Error restoring state:", e);
        }
      }
      
      // First time user - get public data
      console.log("🆕 New user - fetching public data");
      performSearch({ reset: true, forcePublic: true });
      initialized.current = true;
    };
    
    loadInitialData();
    
    // Emergency timeout
    const emergencyTimeout = setTimeout(() => {
      if (isMounted.current && (loading || initialLoading)) {
        console.warn("⚠️ Emergency loading reset after 10s");
        setLoading(false);
        setInitialLoading(false);
      }
    }, 10000);
    
    return () => {
      isMounted.current = false;
      clearTimeout(emergencyTimeout);
    };
  }, []);
  
  // Return hook values
  return {
    sounds,
    loading,
    initialLoading,
    language,
    searchTerm,
    error,
    currentPage,
    hasNextPage,
    totalPages,
    totalItems,
    fetchSounds: useCallback((options) => {
      performSearch({
        ...options,
        lang: options.newLanguage || options.lang || languageRef.current,
        page: options?.reset === false ? currentPage : 1
      });
    }, [currentPage]),
    handleSearchInput,
    handleLanguageChange,
    handleExplicitSearch,
    resetError: useCallback(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setError(null);
      window.location.reload();
    }, [])
  };
}
