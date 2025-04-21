import { useState, useEffect, useRef, useCallback } from "react";

export default function useSoundsData(idToken) {
  // Basic states
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false); // Start false to avoid issues
  const [language, setLanguage] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('preferred_language') || "English";
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Simple refs
  const isMounted = useRef(true);
  const initialized = useRef(false);
  
  // SIMPLIFIED: Put "search" function outside useCallback to avoid dependency issues
  async function performSearch(options = {}) {
    const {
      reset = true,
      lang = language,
      term = searchTerm,
      page = reset ? 1 : currentPage
    } = options;
    
    // Prevent duplicate requests
    if (loading) {
      console.log("Already loading, ignoring request");
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    console.log(`Searching with: language=${lang}, term="${term}", page=${page}`);
    
    try {
      // Get token
      const token = idToken || localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token');
      }
      
      // Build request
      const requestBody = {
        language: lang,
        limit: 20,
        page
      };
      
      // Add search term if present
      if (term?.trim()) {
        requestBody.search = term.trim();
      }
      
      // Make request
      const response = await fetch(
        'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net/getAllSoundsMetadata',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        }
      );
      
      // Handle errors
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      // Parse response
      const data = await response.json();
      if (!data?.result?.success) {
        throw new Error('Invalid API response');
      }
      
      // Get sounds
      const newSounds = data.result.data || [];
      console.log(`Got ${newSounds.length} sounds`);
      
      // Update state if still mounted
      if (isMounted.current) {
        // Update sounds
        setSounds(prev => reset ? newSounds : [...prev, ...newSounds]);
        
        // Update pagination
        setHasNextPage(data.result.pagination.hasNextPage);
        setTotalPages(data.result.pagination.totalPages);
        setTotalItems(data.result.pagination.totalItems);
        setCurrentPage(reset ? 2 : page + 1);
        
        // Clear errors
        setError(null);
        
        // Save state to session storage
        saveStateToSession(
          reset ? newSounds : [...(reset ? [] : sounds), ...newSounds],
          reset ? 2 : page + 1,
          data.result.pagination,
          lang,
          term
        );
      }
    } catch (err) {
      console.error('Search error:', err);
      if (isMounted.current) {
        setError(`Could not load sounds: ${err.message}`);
      }
    } finally {
      // Always reset loading state if mounted
      if (isMounted.current) {
        setLoading(false);
        setInitialLoading(false);
      }
    }
  }
  
  // Helper to save state to session storage
  function saveStateToSession(soundsList, pageNum, pagination, lang, term) {
    if (!soundsList?.length) return;
    
    try {
      const stateToSave = {
        sounds: soundsList,
        currentPage: pageNum,
        hasNextPage: pagination?.hasNextPage || false,
        totalPages: pagination?.totalPages || 0,
        totalItems: pagination?.totalItems || 0,
        language: lang,
        searchTerm: term,
        scrollPosition: window.pageYOffset,
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('sounds_page_state', JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error saving sounds state to session", e);
    }
  }
  
  // Simple language change handler - no dependencies
  const handleLanguageChange = useCallback((newLanguage) => {
    if (!newLanguage || newLanguage === language) return;
    
    console.log(`Changing language to: ${newLanguage}`);
    
    // First update localStorage
    localStorage.setItem('preferred_language', newLanguage);
    
    // Then update state
    setLanguage(newLanguage);
    
    // Execute search after a small delay (if initialized)
    if (initialized.current) {
      setTimeout(() => {
        if (isMounted.current) {
          performSearch({ reset: true, lang: newLanguage });
        }
      }, 10);
    }
  }, [language]); // Only depend on language
  
  // Simple search input handler - no dependencies
  const handleSearchInput = useCallback((value) => {
    setSearchTerm(value);
  }, []);
  
  // Simple search trigger - no dependencies
  const handleExplicitSearch = useCallback(() => {
    console.log("Search button clicked");
    performSearch({ reset: true });
  }, [searchTerm, language]); // Depend on current search term and language
  
  // Initialization effect - runs once
  useEffect(() => {
    // Try to restore from session storage
    const savedState = sessionStorage.getItem('sounds_page_state');
  
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        
        // Only use state if it's recent (less than 30 min old)
        if (Date.now() - parsedState.timestamp < 30 * 60 * 1000) {
          console.log("Restoring saved state");
          
          // Get current language preference from localStorage
          const storedLang = localStorage.getItem('preferred_language');
          
          // CRITICAL FIX: Only restore sounds if the language matches
          if (storedLang && parsedState.language === storedLang) {
            // Language matches - restore everything
            setSounds(parsedState.sounds || []);
            setCurrentPage(parsedState.currentPage || 1);
            setHasNextPage(parsedState.hasNextPage || false);
            setTotalPages(parsedState.totalPages || 0);
            setTotalItems(parsedState.totalItems || 0);
          } else {
            // Language is different - don't restore sounds
            console.log("Language changed - clearing previous sounds");
            setSounds([]);
            setCurrentPage(1);
            setHasNextPage(false);
            setTotalPages(0);
            setTotalItems(0);
          }
          
          // Always set language from localStorage
          setLanguage(storedLang || "English");
          
          // Restore search term
          setSearchTerm(parsedState.searchTerm || "");
          
          initialized.current = true;
          
          // If language changed, we need to fetch new data
          if (storedLang && parsedState.language !== storedLang) {
            setTimeout(() => {
              if (isMounted.current) {
                performSearch({ reset: true, lang: storedLang });
              }
            }, 50);
          }
          
          return; // Skip initial fetch below
        }
      } catch (e) {
        console.error("Error restoring state:", e);
      }
    }
    
    
    // If we got here, we didn't restore state
    
    // Make initial fetch with slight delay
    setTimeout(() => {
      if (isMounted.current) {
        const token = idToken || localStorage.getItem('access_token');
        if (token) {
          performSearch({ reset: true });
        } else {
          setInitialLoading(false);
        }
      }
      
      initialized.current = true;
    }, 50);
    
    // Emergency timeout to ensure loading state doesn't get stuck
    const emergencyTimeout = setTimeout(() => {
      if (isMounted.current && (loading || initialLoading)) {
        console.log("🚨 Emergency loading reset");
        setLoading(false);
        setInitialLoading(false);
      }
    }, 10000);
    
    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      clearTimeout(emergencyTimeout);
    };
  }, []); // Empty dependency array - run once
  
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
    fetchSounds: useCallback(performSearch, []), // For compatibility
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
