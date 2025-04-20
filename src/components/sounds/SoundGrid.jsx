import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SoundCard from "./SoundCard";

export default function SoundGrid({ 
  sounds, 
  loading,
  totalItems,
  hasNextPage,
  isAnonymousGuest,
  loadingIndicatorRef,
  onShowAuthBanner,
  initialLoading
}) {
  return (
    <div className="flex-1 max-w-full">
      {totalItems > 0 && (
        <div className="text-center text-gray-500 mb-4">
          Showing {sounds.length} of {totalItems} sounds
        </div>
      )}

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {sounds.map(sound => (
          <SoundCard 
            key={sound.id} 
            sound={sound}
            isAnonymousGuest={isAnonymousGuest}
            onInteraction={isAnonymousGuest ? onShowAuthBanner : undefined}
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
    </div>
  );
}
