import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from 'framer-motion';

export default function VoiceSelector({ voices, isOpen, onClose, onSelectVoice, selectedVoice }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Choose a Voice</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {voices.map((voice) => (
            <motion.div
              key={voice.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectVoice(voice.id)}
              className={`
                relative cursor-pointer rounded-lg overflow-hidden border-2
                ${selectedVoice === voice.id ? 'border-purple-500 ring-2 ring-purple-400' : 'border-gray-200'}
                transition-all duration-200 hover:shadow-md
              `}
            >
              <div className="bg-gradient-to-b from-transparent to-black/60 absolute inset-0 z-10" />
              
              <img 
                src={voice.image} 
                alt={voice.name} 
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-2 z-20 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{voice.icon}</span>
                  <span className="font-medium">{voice.name}</span>
                </div>
              </div>
              
              {selectedVoice === voice.id && (
                <div className="absolute top-2 right-2 bg-purple-600 rounded-full h-6 w-6 flex items-center justify-center z-30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
