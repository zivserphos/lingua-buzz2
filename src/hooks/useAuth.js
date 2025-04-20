import { useState, useEffect, useRef } from "react";

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDd5pPm43-tcWYQiWnVQPCppnByOZw4Ufo',
  authDomain: 'meme-soundboard-viral-alarm.firebaseapp.com',
  projectId: 'meme-soundboard-viral-alarm',
  storageBucket: 'meme-soundboard-viral-alarm.appspot.com',
  messagingSenderId: '622937397281',
  appId: '1:622937397281:ios:d4e34f90742f0ac7782b60',
};

export default function useAuth() {
  // Auth state
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAnonymousGuest, setIsAnonymousGuest] = useState(false);
  const [showAuthBanner, setShowAuthBanner] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [guestUsername, setGuestUsername] = useState("");
  const [error, setError] = useState(null);

  const isRefreshing = useRef(false);
  const isMounted = useRef(true);
  
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

  // Token refresh logic
  const refreshAccessToken = async (refreshToken = null) => {
    if (isRefreshing.current) {
      console.log("Token refresh already in progress, waiting...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (localStorage.getItem('access_token')) {
        return true; // Another refresh succeeded while we were waiting
      }
      
      return false;
    }
    
    isRefreshing.current = true;

    try {
      const token = refreshToken || localStorage.getItem('refresh_token');
      if (!token) {
        console.error('No refresh token available');
        return false;
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
        const errorData = await response.json().catch(() => ({}));
        console.error('Token refresh failed with status:', response.status, errorData);
        throw new Error(`Failed to refresh token: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data.id_token) {
        console.error('Token refresh response missing id_token:', data);
        throw new Error('Token refresh response missing id_token');
      }
  
      // Update tokens in localStorage
      localStorage.setItem('access_token', data.id_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      
      // Update state
      if (isMounted.current) {
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
      }
      
      console.log("Token refresh successful");
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      if (error.message.includes('400') || error.message.includes('Invalid')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('is_anonymous_guest');
        if (isMounted.current) {
          setUser(null);
          setIdToken(null);
          setIsAnonymousGuest(false);
        }
      }
      return false;
    } finally {
      isRefreshing.current = false;
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
  
  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      const provider = new window.firebase.auth.GoogleAuthProvider();
      const result = await window.firebase.auth().signInWithPopup(provider);
      const token = await result.user.getIdToken();
      
      // Send idToken to our backend
      const response = await fetch('https://googleauth-stbfcg576q-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            idToken: token,
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

  // Initialize Firebase on component mount with refresh token logic
  useEffect(() => {
    isMounted.current = true;
    
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
            if (isMounted.current) setupAuth();
          };
        };
      } catch (error) {
        console.error("Firebase initialization error:", error);
        if (isMounted.current) {
          setAuthLoading(false);
          
          // Even if Firebase fails, try to create anonymous guest
          createAnonymousGuest().then(success => {
            if (isMounted.current) setAuthLoading(false);
          });
        }
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
        if (isMounted.current) {
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
            setTimeout(() => {
              if (isMounted.current) setShowAuthBanner(true);
            }, 1000);
          }
          
          setAuthLoading(false);
        }
      } 
      // If we have a refresh token but no access token, refresh it
      else if (refreshToken) {
        const success = await refreshAccessToken(refreshToken);
        if (!success && isMounted.current) {
          // If refresh failed, create anonymous guest
          await createAnonymousGuest();
        }
        if (isMounted.current) setAuthLoading(false);
      } 
      // No tokens, create anonymous guest
      else {
        await createAnonymousGuest();
        if (isMounted.current) setAuthLoading(false);
      }
      
      // Set up auth state listener for new sign-ins
      const auth = window.firebase.auth();
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser && isMounted.current) {
          try {
            const token = await currentUser.getIdToken();
            setIdToken(token);
            localStorage.setItem('access_token', token);
            localStorage.removeItem('is_anonymous_guest'); // No longer anonymous
            setIsAnonymousGuest(false);
            
            setUser(currentUser);
          } catch (error) {
            console.error('Error getting token:', error);
          }
        }
      });
      
      return () => {
        unsubscribe();
      };
    };
    
    initFirebase();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    user,
    idToken,
    authLoading,
    isAnonymousGuest,
    showAuthBanner,
    showGuestDialog,
    guestUsername,
    error,
    handleGoogleSignIn,
    handleGuestDialogOpen,
    handleGuestSignIn,
    handleSignOut,
    refreshAccessToken,
    setShowAuthBanner,
    setShowGuestDialog,
    setGuestUsername,
  };
}
