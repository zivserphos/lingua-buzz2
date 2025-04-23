import { useState, useEffect, useRef, useCallback } from "react";

// Constants
const PUBLIC_API_URL = 'https://publicmetadata-stbfcg576q-uc.a.run.app';
const AUTH_API_URL = 'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net/getAllSoundsMetadata';

export default function useSoundsData(idToken) {
  // State variables
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [language, setLanguage] = useState(() => localStorage.getItem('preferred_language') || "English");
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
  
  // Update refs when values change
  useEffect(() => { searchTermRef.current = searchTerm; }, [searchTerm]);
  useEffect(() => { languageRef.current = language; }, [language]);
  
  // Main search function
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
      forcePublic = isFirstLoad.current // Force public API for first load
    } = options;
    
    // Set loading state
    setLoading(true);
    
    console.log(`🔍 Searching: language=${lang}, term="${term}", page=${page}, forcePublic=${forcePublic}`);
    
    try {
      // Determine authentication status
      const token = idToken || localStorage.getItem('access_token');
      const hasValidToken = !!(token && token.length > 10);
      const isAuthenticated = hasValidToken && !forcePublic;
      
      console.log(`🔑 Auth status: ${isAuthenticated ? 'Authenticated' : 'Anonymous/Public'}`);
      
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
      console.log(`📡 Using API: ${isAuthenticated ? 'AUTH' : 'PUBLIC'}`);
      
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
  
  // Save state to session storage
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
  
  // Language change handler
  const handleLanguageChange = useCallback((newLanguage) => {
    if (!newLanguage || newLanguage === language) return;
    
    localStorage.setItem('preferred_language', newLanguage);
    setLanguage(newLanguage);
    
    if (initialized.current) {
      performSearch({ reset: true, lang: newLanguage });
    }
  }, [language]);
  
  // Search handlers
  const handleSearchInput = useCallback(value => setSearchTerm(value), []);
  const handleExplicitSearch = useCallback(() => {
    performSearch({ reset: true, term: searchTermRef.current, lang: languageRef.current });
  }, []);
  
  // Initialize on mount
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
            
            const storedLang = localStorage.getItem('preferred_language') || "English";
            
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
        lang: options.lang || languageRef.current,
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
