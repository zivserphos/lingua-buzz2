import React, { useRef, useCallback } from "react"; // Add useCallback
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Ads components
import BottomFixedAd from "@/components/ads/BottomFixedAd";
import LeftSideAd from "@/components/ads/LeftSideAd";
import RightSideAd from "@/components/ads/RightSideAd";

// Auth components
import AuthBanner from "@/components/auth/AuthBanner";
import GuestDialog from "@/components/auth/GuestDialog";

// Sound components
import Header from "@/components/sounds/Header";
import SearchControls from "@/components/sounds/SearchControls";
import SoundGrid from "@/components/sounds/SoundGrid";
import ErrorMessage from "@/components/sounds/ErrorMessage";

// Custom hooks
import useAuth from "@/hooks/useAuth";
import useSoundsData from "@/hooks/useSoundsData";
import useAdSense from "@/hooks/useAdSense";

export default function SoundsPage() {
  const loadingIndicatorRef = useRef(null);
  
  // Initialize ad loading
  useAdSense();
  
  // Authentication state and methods
  const { 
    user, 
    idToken,
    authLoading,
    isAnonymousGuest,
    showAuthBanner,
    showGuestDialog,
    guestUsername,
    handleGoogleSignIn,
    handleGuestDialogOpen,
    handleGuestSignIn,
    handleSignOut,
    setShowAuthBanner,
    setShowGuestDialog,
    setGuestUsername,
  } = useAuth();
  
  // Sounds data and methods
  const {
    sounds,
    loading,
    initialLoading,
    language,
    searchTerm,
    error,
    totalItems,
    fetchSounds,
    handleSearchInput,
    handleLanguageChange,
    handleExplicitSearch, // Use explicit search handler
    hasNextPage,
    currentPage,
  } = useSoundsData(idToken);

  // NEW: Add callback for loading more items
  const handleLoadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      console.log(`Loading more sounds (page ${currentPage})`);
      fetchSounds({ reset: false }); // Load more items without resetting
    }
  }, [fetchSounds, loading, hasNextPage, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <BottomFixedAd />
      
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Authentication banner */}
        <AuthBanner 
          show={showAuthBanner && isAnonymousGuest}
          onGuestClick={handleGuestDialogOpen}
          onSignInClick={handleGoogleSignIn}
          onClose={() => setShowAuthBanner(false)}
        />

        {/* Header with title and auth buttons */}
        <Header 
          user={user}
          isAnonymousGuest={isAnonymousGuest}
          authLoading={authLoading}
          onGuestClick={handleGuestDialogOpen}
          onSignInClick={handleGoogleSignIn}
          onSignOutClick={handleSignOut}
        />

        {/* Search and language controls */}
        <SearchControls 
          searchTerm={searchTerm}
          language={language}
          onSearchChange={handleSearchInput}
          onLanguageChange={handleLanguageChange}
          onSearch={handleExplicitSearch} // FIXED: Use handleExplicitSearch
        />

        {/* Error message */}
        {error && (
          <ErrorMessage 
            error={error}
            onRetry={() => fetchSounds({ reset: true })}
          />
        )}

        {/* Loading state or content */}
        {initialLoading ? (
          <div className="flex flex-col justify-center items-center min-h-[300px]">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
            <p className="text-sm text-gray-500 mb-2">Loading sounds...</p>
            <Button 
              onClick={() => {
                fetchSounds({ reset: true });
              }}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Reset Loading
            </Button>
          </div>
        ) : (
          <div className="flex">
            {/* LEFT SIDE AD */}
            <div className="hidden xl:block fixed left-0 top-1/2 transform -translate-y-1/2 ml-4" style={{ width: '160px', zIndex: 40 }}>
              <LeftSideAd />
            </div>
            
            {/* MAIN CONTENT */}
            <SoundGrid
              sounds={sounds}
              loading={loading}
              totalItems={totalItems}
              hasNextPage={hasNextPage}
              isAnonymousGuest={isAnonymousGuest}
              loadingIndicatorRef={loadingIndicatorRef}
              onShowAuthBanner={() => setShowAuthBanner(true)}
              initialLoading={initialLoading}
              onLoadMore={handleLoadMore} // FIXED: Add onLoadMore prop
              language={language}
            />
            
            {/* RIGHT SIDE AD */}
            <div className="hidden xl:block fixed right-0 top-1/2 transform -translate-y-1/2 mr-4" style={{ width: '160px', zIndex: 40 }}>
              <RightSideAd />
            </div>
          </div>
        )}
      </div>

      {/* Guest Username Dialog */}
      <GuestDialog
        open={showGuestDialog}
        isAnonymousGuest={isAnonymousGuest}
        username={guestUsername}
        onOpenChange={setShowGuestDialog}
        onUsernameChange={(e) => setGuestUsername(e.target.value)}
        onSubmit={handleGuestSignIn}
      />
      
      {/* Ad styles */}
      <style jsx>{`
        .ad-container {
          min-height: 250px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .left-side-ad, .right-side-ad {
          min-width: 160px;
          min-height: 600px;
        }
        
        .bottom-fixed-ad {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          min-height: 90px;
          background: white;
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .left-side-ad, .right-side-ad {
            min-height: 250px;
          }
        }
      `}</style>
    </div>
  );
}
