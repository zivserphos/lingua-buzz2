
import React, { useState, useEffect, useRef, useCallback } from "react";
import LanguageSelector from "../components/sounds/LanguageSelector";
import SoundCard from "../components/sounds/SoundCard";
import Search from "../components/sounds/Search";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LogIn, LogOut, Trophy, Loader2, User, X, Save, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { debounce } from 'lodash';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDd5pPm43-tcWYQiWnVQPCppnByOZw4Ufo',
  authDomain: 'meme-soundboard-viral-alarm.firebaseapp.com',
  projectId: 'meme-soundboard-viral-alarm',
  storageBucket: 'meme-soundboard-viral-alarm.appspot.com',
  messagingSenderId: '622937397281',
  appId: '1:622937397281:ios:d4e34f90742f0ac7782b60',
};

export default function SoundsPage() {
  // Auth state
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAnonymousGuest, setIsAnonymousGuest] = useState(false);
  const [showAuthBanner, setShowAuthBanner] = useState(false);
  
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
  
  // Guest auth dialog
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [guestUsername, setGuestUsername] = useState("");
  
  // Refs for intersection observer
  const loadingIndicatorRef = useRef(null);
  const observerRef = useRef(null);
  
  // Function to decode JWT token and extract user information
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  };
  
  // Create an automatic anonymous guest account
  const createAnonymousGuest = async () => {
    try {
      console.log("Creating anonymous guest account");
      
      // Generate a random username
      const randomId = Math.random().toString(36).substring(2, 10);
      const tempUsername = `guest_${randomId}`;
      
      // Make request to create guest user
      const response = await fetch(
        'https://guestauth-stbfcg576q-uc.a.run.app',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              username: tempUsername,
              isAnonymous: true
            }
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.result || !data.result.success) {
        throw new Error(data.result?.error_message || 'Failed to create anonymous guest');
      }
      
      // Store tokens securely in localStorage
      localStorage.setItem('access_token', data.result.data.access_token);
      localStorage.setItem('refresh_token', data.result.data.refresh_token);
      localStorage.setItem('is_anonymous_guest', 'true');
      
      // Set user data
      setUser({
        email: data.result.data.email || `${tempUsername}@guest.com`,
        uid: data.result.data.uid,
        profile_image: data.result.data.profile_image,
        role: 'anonymous_guest'
      });
      
      setIdToken(data.result.data.access_token);
      setIsAnonymousGuest(true);
      
      // Show auth banner after a slight delay to let users see content first
      setTimeout(() => setShowAuthBanner(true), 3000);
      
      console.log("Anonymous guest login successful");
      return true;
    } catch (error) {
      console.error('Anonymous guest creation error:', error);
      return false;
    }
  };
  
  // Initialize Firebase on component mount with refresh token logic
  useEffect(() => {
    let cleanup = false;
    
    const initFirebase = async () => {
      try {
        // Check if Firebase is already available
        if (window.firebase) {
          await setupAuth();
          return;
        }
        
        // Load Firebase scripts
        const firebaseAppScript = document.createElement('script');
        firebaseAppScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
        
        const firebaseAuthScript = document.createElement('script');
        firebaseAuthScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
        
        document.head.appendChild(firebaseAppScript);
        document.head.appendChild(firebaseAuthScript);
        
        // Wait for scripts to load
        firebaseAppScript.onload = () => {
          firebaseAuthScript.onload = () => {
            if (!cleanup) setupAuth();
          };
        };
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setAuthLoading(false);
        
        // Even if Firebase fails, try to create anonymous guest
        createAnonymousGuest().then(success => {
          setAuthLoading(false);
        });
      }
    };
    
    const setupAuth = async () => {
      if (!window.firebase.apps || !window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
      }
      
      // Try to restore session from local storage
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const isAnonymous = localStorage.getItem('is_anonymous_guest') === 'true';
      
      // If we have an access token, use it directly
      if (accessToken) {
        setIdToken(accessToken);
        setIsAnonymousGuest(isAnonymous);
        
        // Try to decode the token to get user info
        const payload = decodeToken(accessToken);
        if (payload) {
          setUser({
            uid: payload.user_id || payload.sub,
            email: payload.email,
            role: isAnonymous ? 'anonymous_guest' : 'user'
          });
        }
        
        // If this is an anonymous guest, show the auth banner
        if (isAnonymous) {
          setTimeout(() => setShowAuthBanner(true), 1000);
        }
        
        setAuthLoading(false);
      } 
      // If we have a refresh token but no access token, refresh it
      else if (refreshToken) {
        const success = await refreshAccessToken(refreshToken);
        if (!success) {
          // If refresh failed, create anonymous guest
          await createAnonymousGuest();
        }
        setAuthLoading(false);
      } 
      // No tokens, create anonymous guest
      else {
        await createAnonymousGuest();
        setAuthLoading(false);
      }
      
      // Set up auth state listener for new sign-ins
      const auth = window.firebase.auth();
      auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          try {
            const token = await currentUser.getIdToken();
            setIdToken(token);
            localStorage.setItem('access_token', token);
            localStorage.removeItem('is_anonymous_guest'); // No longer anonymous
            setIsAnonymousGuest(false);
            
            setUser(currentUser);
            
            // Set up token refresh every 30 minutes
            const tokenRefreshInterval = setInterval(async () => {
              try {
                const refreshedToken = await currentUser.getIdToken(true);
                setIdToken(refreshedToken);
                localStorage.setItem('access_token', refreshedToken);
              } catch (error) {
                console.error('Token refresh error:', error);
              }
            }, 30 * 60 * 1000);
            
            return () => clearInterval(tokenRefreshInterval);
          } catch (error) {
            console.error('Error getting token:', error);
          }
        }
      });
    };
    
    initFirebase();
    
    return () => {
      cleanup = true;
    };
  }, []);
  
  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loadingIndicatorRef.current && hasNextPage) {
      setupIntersectionObserver();
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, loading]);
  
  // Load sounds when user is authenticated
  useEffect(() => {
    if (idToken) {
      resetAndFetchSounds();
    } else if (!authLoading) {
      setInitialLoading(false);
    }
  }, [idToken]);

  // Handle language change
  useEffect(() => {
    if (idToken && !initialLoading) {
      resetAndFetchSounds();
    }
  }, [language]);
  
  // Set up intersection observer for infinite loading
  const setupIntersectionObserver = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !loading) {
        fetchSounds();
      }
    }, { rootMargin: '200px' });
    
    observerRef.current.observe(loadingIndicatorRef.current);
  };
  
  // Reset pagination and fetch sounds
  const resetAndFetchSounds = () => {
    setSounds([]);
    setCurrentPage(1);
    setHasNextPage(false);
    setTotalPages(0);
    setTotalItems(0);
    fetchSounds(true);
  };

  // Fetch sounds from Firebase API

const fetchSounds = async (isReset = false, retryCount = 0) => {
  // Check if already loading or missing token
  if (loading || !idToken) return;
  
  // Check for too many retry attempts (prevent infinite loops)
  if (retryCount > 2) {
    setError("Too many failed attempts. Please reload the page.");
    setLoading(false);
    return;
  }
  
  const page = isReset ? 1 : currentPage;
  setLoading(true);
  
  try {
    // First check if token will expire soon (within 5 minutes)
    const tokenPayload = decodeToken(idToken);
    if (tokenPayload && tokenPayload.exp) {
      const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeToExpiration = expirationTime - currentTime;
      
      // Proactively refresh token if it expires in less than 5 minutes
      if (timeToExpiration < 5 * 60 * 1000) {
        console.log("Token expiring soon, refreshing proactively...");
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const success = await refreshAccessToken(refreshToken);
          if (!success) {
            throw new Error('Token refresh failed. Please login again.');
          }
          // If we successfully refreshed the token, we can continue with the request
        }
      }
    }
    
    // Proceed with request
    const requestBody = {
      language,
      limit: 20,
      page,
      ...(searchTerm && { search: searchTerm })
    };
    
    console.log(`Fetching sounds: page ${page}, language ${language}, search: "${searchTerm}"`);
    
    const response = await fetch(
      'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net/getAllSoundsMetadata',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(requestBody)
      }
    );

    // Handle unauthorized error (401)
    if (response.status === 401) {
      console.log("Unauthorized (401). Attempting token refresh...");
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        const refreshSuccess = await refreshAccessToken(refreshToken);
        
        if (refreshSuccess) {
          console.log("Token refreshed successfully, retrying request...");
          // Add a slight delay before retrying to prevent rapid requests
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Retry with incremented retry counter
          setLoading(false);
          return fetchSounds(isReset, retryCount + 1);
        } else {
          // If token refresh failed, don't retry automatically
          throw new Error('Authentication failed. Please sign in again.');
        }
      } else {
        throw new Error('Not authenticated. Please login.');
      }
    }

    // Handle other errors
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Parse response
    const data = await response.json();
    
    if (!data.result?.success) {
      throw new Error(data.result?.message || 'Invalid response format');
    }

    // Successfully got data, update state
    const newSounds = data.result.data || [];
    
    console.log(`Fetched ${newSounds.length} sounds. Has next page: ${data.result.pagination.hasNextPage}`);

    setSounds(prev => isReset ? newSounds : [...prev, ...newSounds]);
    setHasNextPage(data.result.pagination.hasNextPage);
    setTotalPages(data.result.pagination.totalPages);
    setTotalItems(data.result.pagination.totalItems);
    setCurrentPage(page + 1);
    setError(null);

  } catch (error) {
    console.error('Error fetching sounds:', error);
    setError(error.message);
    
    // If the error is related to authentication but not handled above,
    // create a new anonymous guest if needed
    if (error.message.includes('authentication') || error.message.includes('login')) {
      if (!isAnonymousGuest) {
        console.log("Authentication error, creating anonymous guest...");
        // Only try to create guest after a delay to prevent loops
        setTimeout(() => {
          createAnonymousGuest();
        }, 2000);
      }
    }
  } finally {
    setLoading(false);
    setInitialLoading(false);
  }
};

  const refreshAccessToken = async (refreshToken = null) => {
    try {
      const token = refreshToken || localStorage.getItem('refresh_token');
      if (!token) {
        throw new Error('No refresh token available');
      }

      console.log("Refreshing access token...");
      
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: token
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
      
      // Update state
      setIdToken(data.id_token);
      
      // Update user info from token
      const payload = decodeToken(data.id_token);
      if (payload) {
        setUser({
          uid: payload.user_id || payload.sub,
          email: payload.email,
          role: localStorage.getItem('is_anonymous_guest') === 'true' ? 'anonymous_guest' : 'user'
        });
      }
      
      console.log("Token refresh successful");
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Only clear tokens on specific errors - not all refresh failures should log out the user
      if (error.message.includes('400') || error.message.includes('Invalid')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('is_anonymous_guest');
        setUser(null);
        setIdToken(null);
        setIsAnonymousGuest(false);
      }
      return false;
    }
  };

  // Convert anonymous guest to named guest
  const convertToNamedGuest = async () => {
    if (!guestUsername || guestUsername.trim() === '') {
      setError("Please enter a username");
      return;
    }
    
    try {
      setAuthLoading(true);
      setShowGuestDialog(false);
      
      // Make request to update guest user with chosen username
      const response = await fetch(
        'https://guestauth-stbfcg576q-uc.a.run.app/updateGuest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            data: {
              username: guestUsername,
              isAnonymous: false
            }
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.result || !data.result.success) {
        throw new Error(data.result?.error_message || 'Failed to update guest account');
      }
      
      // Update tokens if returned
      if (data.result.data.access_token) {
        localStorage.setItem('access_token', data.result.data.access_token);
      }
      
      if (data.result.data.refresh_token) {
        localStorage.setItem('refresh_token', data.result.data.refresh_token);
      }
      
      // No longer anonymous
      localStorage.removeItem('is_anonymous_guest');
      setIsAnonymousGuest(false);
      setShowAuthBanner(false);
      
      // Set user data
      setUser({
        ...user,
        email: data.result.data.email || `${guestUsername}@guest.com`,
        displayName: guestUsername,
        role: 'guest'
      });
      
      console.log("Guest account upgraded successfully");
      
    } catch (error) {
      console.error('Guest upgrade error:', error);
      setError("Failed to save your username. " + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    resetAndFetchSounds();
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      const provider = new window.firebase.auth.GoogleAuthProvider();
      const result = await window.firebase.auth().signInWithPopup(provider);
      const idToken = await result.user.getIdToken();
      
      // Send idToken to our backend
      const response = await fetch('https://googleauth-stbfcg576q-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            idToken,
            previousGuestId: isAnonymousGuest ? user?.uid : null // Pass the anonymous ID to merge data
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to authenticate with backend: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.result?.success) {
        throw new Error(data.result?.error_message || 'Authentication failed');
      }

      // Store tokens
      localStorage.setItem('access_token', data.result.data.access_token);
      localStorage.setItem('refresh_token', data.result.data.refresh_token);
      localStorage.removeItem('is_anonymous_guest'); // No longer anonymous
      
      // Set user data
      setUser({
        email: data.result.data.email,
        uid: data.result.data.uid,
        profile_image: data.result.data.profile_image,
        role: data.result.data.role
      });
      
      setIdToken(data.result.data.access_token);
      setIsAnonymousGuest(false);
      setShowAuthBanner(false);
      
    } catch (error) {
      console.error('Google login error:', error);
      setError("Login failed: " + error.message);
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Handle guest sign in
  const handleGuestDialogOpen = () => {
    setShowGuestDialog(true);
  };
  
  const handleGuestSignIn = async () => {
    // If already an anonymous guest, just upgrade the account
    if (isAnonymousGuest) {
      await convertToNamedGuest();
      return;
    }
    
    if (!guestUsername || guestUsername.trim() === '') {
      setError("Please enter a username");
      return;
    }
    
    try {
      setAuthLoading(true);
      setShowGuestDialog(false);
      
      console.log("Creating named guest account with username:", guestUsername);
      
      // Make request to create guest user
      const response = await fetch(
        'https://guestauth-stbfcg576q-uc.a.run.app',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              username: guestUsername,
              isAnonymous: false
            }
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.result || !data.result.success) {
        throw new Error(data.result?.error_message || 'Failed to create guest account');
      }
      
      // Store tokens securely in localStorage
      localStorage.setItem('access_token', data.result.data.access_token);
      localStorage.setItem('refresh_token', data.result.data.refresh_token);
      localStorage.removeItem('is_anonymous_guest'); // Not anonymous
      
      // Set user data
      setUser({
        email: data.result.data.email || `${guestUsername}@guest.com`,
        uid: data.result.data.uid,
        profile_image: data.result.data.profile_image,
        role: data.result.data.role || 'guest'
      });
      
      setIdToken(data.result.data.access_token);
      setIsAnonymousGuest(false);
      setShowAuthBanner(false);
      
      console.log("Guest login successful");
      
    } catch (error) {
      console.error('Guest login error:', error);
      setError("Guest login failed. " + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      
      // Clear all tokens and user data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('is_anonymous_guest');
      
      // Clear auth state
      setUser(null);
      setIdToken(null);
      setSounds([]);
      setIsAnonymousGuest(false);
      setShowAuthBanner(false);
      
      // Sign out from Firebase if available
      if (window.firebase?.auth) {
        await window.firebase.auth().signOut();
      }
      
      // Create a new anonymous guest
      await createAnonymousGuest();
      
      console.log("Sign out successful");
    } catch (error) {
      console.error('Sign out error:', error);
      setError("Sign out failed. Please try again.");
    }
  };

  // Add debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term !== searchTerm) {
        setSearchTerm(term);
        resetAndFetchSounds();
      }
    }, 500),
    [searchTerm, resetAndFetchSounds]
  );

  const handleSearchInput = (value) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Authentication banner for anonymous guests */}
        <AnimatePresence>
          {showAuthBanner && isAnonymousGuest && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className="bg-purple-50 border-purple-200">
                <div className="flex items-center justify-between">
                  <AlertDescription className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-purple-500" />
                    <span>You're browsing as a guest. Save your progress and unlock achievements!</span>
                  </AlertDescription>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleGuestDialogOpen}
                      className="bg-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Choose Username
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={handleGoogleSignIn}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAuthBanner(false)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Brainrot Hottest Memes 🔥
            </h1>
            <p className="text-gray-600 mt-2">Go crazy with looping brainrot meme sounds with funny effects</p>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={createPageUrl("Leaderboard")}>
                      <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                        Leaderboard
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isAnonymousGuest && (
                    <TooltipContent>
                      <p>Sign in to track your achievements!</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}

            {!isAnonymousGuest && user ? (
              <Button 
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700"
                disabled={authLoading}
              >
                {authLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <>
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </>
                )}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleGuestDialogOpen}
                  variant="outline"
                  className="bg-white/50 backdrop-blur-sm"
                  disabled={authLoading}
                >
                  <User className="w-5 h-5 mr-2" />
                  Save Progress
                </Button>
                
                <Button 
                  onClick={handleGoogleSignIn} 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="flex-1 w-full">
            <Search 
              value={searchTerm} 
              onChange={handleSearchInput} 
              onSearch={resetAndFetchSounds}
            />
          </div>
          <LanguageSelector 
            currentLanguage={language} 
            onLanguageChange={handleLanguageChange} 
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {initialLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : (
          <>
            {totalItems > 0 && (
              <div className="text-center text-gray-500 mb-4">
                Showing {sounds.length} of {totalItems} sounds
              </div>
            )}

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {sounds.map(sound => (
                <SoundCard 
                  key={sound.id} 
                  sound={sound}
                  isAnonymousGuest={isAnonymousGuest}
                  onInteraction={isAnonymousGuest ? () => setShowAuthBanner(true) : undefined}
                />
              ))}
            </motion.div>

            {sounds.length === 0 && !loading && !initialLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No sounds found 😢</p>
                <p className="text-gray-400">Try changing your search or language</p>
              </div>
            )}

            {/* Loading indicator for infinite scroll */}
            <div 
              ref={loadingIndicatorRef} 
              className="flex justify-center mt-8 mb-4 h-10"
            >
              {loading && <Loader2 className="w-8 h-8 animate-spin text-purple-600" />}
            </div>
          </>
        )}
      </div>
      
      {/* Guest Username Dialog */}
      <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isAnonymousGuest ? "Save your progress" : "Choose a username"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter a username"
                value={guestUsername}
                onChange={(e) => setGuestUsername(e.target.value)}
              />
            </div>
            {isAnonymousGuest && (
              <p className="text-sm text-gray-500">
                By choosing a username, you'll keep all your progress and unlock achievements!
              </p>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowGuestDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGuestSignIn}
              disabled={!guestUsername || guestUsername.trim() === ''}
            >
              {isAnonymousGuest ? "Save Progress" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
