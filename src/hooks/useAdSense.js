import { useEffect, useRef } from "react";

export const AD_IDS = {
  LEFT: 'left-side-ad-' + Math.random().toString(36).substring(2, 9),
  RIGHT: 'right-side-ad-' + Math.random().toString(36).substring(2, 9),
  BOTTOM: 'bottom-fixed-ad-' + Math.random().toString(36).substring(2, 9)
};

export default function useAdSense() {
  const initializedAds = useRef(new Set());

  // Load AdSense ads
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Skip if already running
    if (window._adSenseInitializing) return;
    window._adSenseInitializing = true;
    
    // Load the AdSense script once
    const loadAdSenseScript = () => {
      return new Promise((resolve) => {
        // Check if script already exists
        if (document.querySelector('script[src*="adsbygoogle.js"]')) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7696906136083035';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };
    
    // Function to initialize a single ad
    const initializeAd = (adId) => {
      if (!adId || initializedAds.current.has(adId)) return;
      
      const adElement = document.getElementById(adId);
      if (!adElement) return;
      
      try {
        console.log(`Initializing ad: ${adId}`);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        initializedAds.current.add(adId);
      } catch (err) {
        console.error(`Failed to initialize ad ${adId}:`, err);
      }
    };
    
    // Main initialization function
    const initializeAds = async () => {
      await loadAdSenseScript();
      
      // Wait a bit to ensure DOM is ready
      setTimeout(() => {
        // Initialize each ad separately
        initializeAd(AD_IDS.LEFT);
        initializeAd(AD_IDS.RIGHT);
        initializeAd(AD_IDS.BOTTOM);
        
        // Clean up initialization flag
        window._adSenseInitializing = false;
      }, 100);
    };
    
    // Initialize immediately if document is ready
    if (document.readyState === 'complete') {
      initializeAds();
    } else {
      // Otherwise wait for the load event
      window.addEventListener('load', initializeAds);
    }
    
    return () => {
      window.removeEventListener('load', initializeAds);
      window._adSenseInitializing = false;
    };
  }, []);
  
  return AD_IDS;
}
