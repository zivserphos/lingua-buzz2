import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Firebase context
export const FirebaseContext = createContext(null);

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDd5pPm43-tcWYQiWnVQPCppnByOZw4Ufo',
  authDomain: 'meme-soundboard-viral-alarm.firebaseapp.com',
  projectId: 'meme-soundboard-viral-alarm',
  storageBucket: 'meme-soundboard-viral-alarm.appspot.com',
  messagingSenderId: '622937397281',
  appId: '1:622937397281:ios:d4e34f90742f0ac7782b60',
};

// Firebase provider component
export function FirebaseProvider({ children }) {
  const [firebase, setFirebase] = useState(null);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase
  useEffect(() => {
    const initFirebase = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Load Firebase scripts
          const firebaseAppScript = document.createElement('script');
          firebaseAppScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
          
          const firebaseAuthScript = document.createElement('script');
          firebaseAuthScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
          
          document.head.appendChild(firebaseAppScript);
          document.head.appendChild(firebaseAuthScript);
          
          // Wait for scripts to load
          await new Promise(resolve => {
            firebaseAppScript.onload = () => {
              firebaseAuthScript.onload = resolve;
            };
          });
          
          // Now Firebase is available globally
          const app = window.firebase.initializeApp(firebaseConfig);
          const authInstance = window.firebase.auth();
          
          setFirebase(app);
          setAuth(authInstance);
          
          // Check if user is already logged in
          authInstance.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
              const token = await currentUser.getIdToken();
              setIdToken(token);
              
              // Set up token refresh every 30 minutes
              setInterval(async () => {
                const refreshedToken = await currentUser.getIdToken(true);
                setIdToken(refreshedToken);
                console.log('Token refreshed');
              }, 30 * 60 * 1000);
            }
            setLoading(false);
          });
        } catch (error) {
          console.error("Firebase initialization error:", error);
          setLoading(false);
        }
      }
    };

    initFirebase();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      if (auth) {
        const provider = new window.firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        setUser(result.user);
        const token = await result.user.getIdToken();
        setIdToken(token);
        return result.user;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    if (auth) {
      await auth.signOut();
      setUser(null);
      setIdToken(null);
    }
  };

  // Override fetch for media requests
  useEffect(() => {
    if (idToken) {
      const originalFetch = window.fetch;
      window.fetch = function (url, options) {
        if (
          typeof url === 'string' &&
          url.includes('firebasestorage.googleapis.com')
        ) {
          options = options || {};
          options.headers = options.headers || {};
          options.headers['Authorization'] = `Bearer ${idToken}`;
        }
        return originalFetch(url, options);
      };
    }
  }, [idToken]);

  const value = {
    firebase,
    auth,
    user,
    idToken,
    signInWithGoogle,
    signOut,
    loading
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Custom hook to use the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

// Default export for the module
export default FirebaseProvider;