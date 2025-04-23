import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import SoundCard from './SoundCard';

export default function SoundGrid({
  sounds,
  loading,
  totalItems,
  hasNextPage,
  isAnonymousGuest,
  loadingIndicatorRef,
  onShowAuthBanner,
  onShowGuestDialog,
  initialLoading,
  onLoadMore, // NEW: Add callback prop for loading more
  language,
}) {
  // NEW: Add intersection observer for lazy loading
  useEffect(() => {
    if (!loadingIndicatorRef?.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // When loading indicator comes into view and we're not already loading
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          console.log('📜 Intersection observed - loading more sounds');
          onLoadMore();
        }
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    observer.observe(loadingIndicatorRef.current);

    return () => {
      if (loadingIndicatorRef.current) {
        observer.unobserve(loadingIndicatorRef.current);
      }
    };
  }, [loadingIndicatorRef, hasNextPage, loading, onLoadMore]);

  return (
    <div className='flex-1 max-w-full'>
      {totalItems > 0 && (
        <div className='text-center text-gray-500 mb-4'>
          Showing {sounds.length} of {totalItems} sounds
        </div>
      )}

      <motion.div
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {sounds.map((sound) => (
          <SoundCard
            key={sound.id}
            sound={sound}
            isAnonymousGuest={isAnonymousGuest}
            onInteraction={(interactionType) => onShowGuestDialog(interactionType)} 
            language={language}
          />
        ))}
      </motion.div>

      {sounds.length === 0 && !loading && !initialLoading && (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>No sounds found 😢</p>
          <p className='text-gray-400'>Try changing your search or language</p>
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      <div
        ref={loadingIndicatorRef}
        className='flex justify-center mt-8 mb-4 h-16 py-4'
      >
        {loading && hasNextPage && (
          <Loader2 className='w-8 h-8 animate-spin text-purple-600' />
        )}
        {!hasNextPage && sounds.length > 0 && (
          <div className='text-gray-500 text-sm'>No more sounds to load</div>
        )}
      </div>
    </div>
  );
}
