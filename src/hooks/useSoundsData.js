import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from 'lodash';

export default function useSoundsData(idToken) {
  // Sound data state
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [language, setLanguage] = useState("English");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Refs
  const isMounted = useRef(true);
  const restoredStateRef = useRef(false);
  const tokenRefreshInProgress = useRef(false);
  const retryAttempts = useRef(0);
  const lastSearchTerm = useRef("");

  // Function to refresh the access token
  const refreshAccessToken = async (refreshToken) => {
    if (tokenRefreshInProgress.current) {
      return null;
    }
    
    tokenRefreshInProgress.current = true;
    
    try {
      console.log("Refreshing access token...");
      
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=AIzaSyDd5pPm43-tcWYQiWnVQPCppnByOZw4Ufo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.id_token) {
        throw new Error('Token refresh response missing id_token');
      }
      
      // Update tokens in localStorage
      localStorage.setItem('access_token', data.id_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      
      console.log("Token refresh successful");
      retryAttempts.current = 0;
      return data.id_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    } finally {
      tokenRefreshInProgress.current = false;
    }
  };

  // CORE FUNCTIONALITY: Fetch sounds with improved search handling
  const fetchSounds = useCallback(async (isReset = false, retryCount = 0) => {
    // Prevent infinite retry loops
    if (retryCount > 2) {
      console.error("Too many retry attempts, giving up.");
      setError("Authentication failed. Please try signing in again.");
      setLoading(false);
      setInitialLoading(false);
      return;
    }
    
    // Prevent duplicate requests
    if (loading && retryCount === 0) return;
    
    // Reset pagination for new searches
    if (isReset && retryCount === 0) {
      setSounds([]);
      setCurrentPage(1);
    }
    
    const page = isReset ? 1 : currentPage;
    setLoading(true);
    
    // Add timeout to prevent stuck loading state
    const timeoutId = setTimeout(() => {
      console.log("⚠️ API request timed out after 15 seconds");
      if (isMounted.current) {
        setLoading(false);
        setInitialLoading(false);
      }
    }, 15000);
    
    try {
      // Save the current search term to compare later
      lastSearchTerm.current = searchTerm;
      
      // Log what we're searching for
      console.log(`Fetching sounds: page=${page}, language=${language}, search="${searchTerm || ""}" (retry: ${retryCount})`);
      
      // Get current token - try props first, then localStorage
      let accessToken = idToken || localStorage.getItem('access_token');
      
      if (!accessToken) {
        throw new Error('No authentication token available');
      }
      
      // Always use a valid language
      const currentLanguage = language || "English";
      
      // Create request body - IMPORTANT: Only include search param if it has value
      const requestBody = {
        language: currentLanguage,
        limit: 20,
        page
      };
      
      // Only add search term if it's not empty
      if (searchTerm && searchTerm.trim() !== "") {
        requestBody.search = searchTerm.trim();
      }
      
      const response = await fetch(
        'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net/getAllSoundsMetadata',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(requestBody)
        }
      );
      
      clearTimeout(timeoutId);
      
      // Handle unauthorized error (401)
      if (response.status === 401) {
        console.log(`Unauthorized (401). Attempt ${retryCount + 1}/3`);
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          // Try to refresh the token
          const newToken = await refreshAccessToken(refreshToken);
          if (newToken) {
            console.log("Token refreshed, retrying request...");
            return fetchSounds(isReset, retryCount + 1);
          }
        }
        
        // If we get here, token refresh failed
        throw new Error('Authentication failed. Please sign in again.');
      }
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.result || !data.result.success) {
        throw new Error('Invalid API response');
      }
      
      const newSounds = data.result.data || [];
      console.log(`Got ${newSounds.length} sounds`);
      
      // Reset retry counter on success
      retryAttempts.current = 0;
      
      // Check if search term is still the same (user might have typed more while request was in flight)
      if (isMounted.current && lastSearchTerm.current === searchTerm) {
        setSounds(prev => isReset ? newSounds : [...prev, ...newSounds]);
        setHasNextPage(data.result.pagination.hasNextPage);
        setTotalPages(data.result.pagination.totalPages);
        setTotalItems(data.result.pagination.totalItems);
        setCurrentPage(page + 1);
        setError(null);
        
        // Save the state for future return visits
        saveSoundsState(
          isReset ? newSounds : [...(isReset ? [] : sounds), ...newSounds], 
          page + 1, 
          data.result.pagination
        );
      } else {
        console.log("Search term changed while request was in flight, discarding results");
      }
    } catch (error) {
      console.error('Error fetching sounds:', error);
      
      if (isMounted.current) {
        setError(`Could not load sounds: ${error.message}`);
        
        // Clear saved state when we get persistent errors
        if (retryCount > 0) {
          console.log("Clearing saved state due to persistent errors");
          sessionStorage.removeItem('sounds_page_state');
        }
      }
    } finally {
      clearTimeout(timeoutId);
      if (isMounted.current) {
        setLoading(false);
        setInitialLoading(false);
      }
    }
  }, [currentPage, idToken, language, loading, searchTerm, sounds]);
  
  // Save state to session storage for preserving between navigations
  const saveSoundsState = (currentSounds, page, pagination) => {
    if (!currentSounds || currentSounds.length === 0) return;
    
    const stateToSave = {
      sounds: currentSounds,
      currentPage: page,
      hasNextPage: pagination?.hasNextPage || false,
      totalPages: pagination?.totalPages || 0,
      totalItems: pagination?.totalItems || 0,
      language,
      searchTerm,
      scrollPosition: window.pageYOffset,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem('sounds_page_state', JSON.stringify(stateToSave));
  };

  // IMPROVED: Debounced search implementation
  const debouncedSearch = useCallback(
    debounce(() => {
      console.log(`Debounced search triggered with term: "${searchTerm}"`);
      if ((idToken || localStorage.getItem('access_token')) && 
          retryAttempts.current < 3) {
        fetchSounds(true);
      }
    }, 500),
    [fetchSounds]
  );
  
  // Handle explicit search button click or Enter key
  const handleExplicitSearch = useCallback(() => {
    if (idToken || localStorage.getItem('access_token')) {
      console.log(`Explicit search triggered with term: "${searchTerm}"`);
      // Cancel any pending debounced searches
      debouncedSearch.cancel();
      // Execute search immediately
      fetchSounds(true);
    }
  }, [debouncedSearch, fetchSounds, idToken, searchTerm]);
  
  // Handle search input change
  const handleSearchInput = useCallback((value) => {
    console.log(`Search input changed to: "${value}"`);
    setSearchTerm(value);
    // Debounced search will be triggered by the useEffect below
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage) => {
    console.log("Language changed from", language, "to", newLanguage);
    
    // Ensure we have a valid language
    if (!newLanguage || newLanguage.trim() === "") {
      newLanguage = "English";
    }
    
    // Save language preference for return visits
    localStorage.setItem('preferred_language', newLanguage);
    setLanguage(newLanguage);
    
    // Language change will trigger a search via the useEffect
  }, [language]);

  // Effect for search debounce - triggers when searchTerm changes
  useEffect(() => {
    if ((idToken || localStorage.getItem('access_token'))) {
      // If search box is cleared, search immediately
      if (searchTerm === "") {
        debouncedSearch.cancel();
        fetchSounds(true);
        return;
      }
      
      // Otherwise use debounce for better UX during typing
      debouncedSearch();
    }
    
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch, fetchSounds, idToken]);
  
  // Restore state effect
  useEffect(() => {
    // Only attempt to restore state once per mount
    if (!restoredStateRef.current) {
      restoredStateRef.current = true;
      
      // Try to restore state from sessionStorage
      const savedState = sessionStorage.getItem('sounds_page_state');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          const stateTimestamp = parsedState.timestamp || 0;
          
          // Only restore if state is less than 30 minutes old
          if (Date.now() - stateTimestamp < 30 * 60 * 1000) {
            console.log("Restoring previous sounds page state");
            setSounds(parsedState.sounds || []);
            setCurrentPage(parsedState.currentPage || 1);
            setHasNextPage(parsedState.hasNextPage || false);
            setTotalPages(parsedState.totalPages || 0);
            setTotalItems(parsedState.totalItems || 0);
            setLanguage(parsedState.language || "English");
            setSearchTerm(parsedState.searchTerm || "");
            setInitialLoading(false);
            
            // Restore scroll position after a short delay to ensure rendering
            if (parsedState.scrollPosition) {
              setTimeout(() => {
                window.scrollTo(0, parsedState.scrollPosition);
              }, 100);
            }
            
            return; // Skip initial data fetch if we restored state
          }
        } catch (e) {
          console.error('Error restoring sounds page state:', e);
        }
      }

      // Check for saved language preference
      const preferredLanguage = localStorage.getItem('preferred_language');
      if (preferredLanguage) {
        setLanguage(preferredLanguage);
      }
    }
  }, []);
  
  // Load sounds when user is authenticated
  useEffect(() => {
    // If we have a token and haven't restored state yet, fetch sounds
    const token = idToken || localStorage.getItem('access_token');
    if (token && !restoredStateRef.current && sounds.length === 0) {
      fetchSounds(true);
    }
  }, [idToken, fetchSounds, sounds.length]);

  // Handle language change
  useEffect(() => {
    const token = idToken || localStorage.getItem('access_token');
    if (token && !initialLoading && restoredStateRef.current) {
      debouncedSearch.cancel();
      fetchSounds(true);
    }
  }, [language, debouncedSearch, fetchSounds, idToken, initialLoading]);
  
  // Reset error with a sign-in retry button
  const resetError = useCallback(() => {
    // Clear stored tokens to force re-login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    retryAttempts.current = 0;
    setError(null);
    window.location.reload();
  }, []);
  
  // Cleanup when unmounting
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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
    fetchSounds,
    handleSearchInput,
    handleLanguageChange,
    handleExplicitSearch, // New method for explicit search button click
    resetError
  };
}
