import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence import
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogIn, Save, UserCheck, X } from 'lucide-react';

export default function AuthBanner({ show, onGuestClick, onSignInClick, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 sm:mb-6"
        >
          <Alert className="bg-purple-50 border-purple-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <AlertDescription className="flex items-center gap-2 mb-3 sm:mb-0">
                <UserCheck className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm">Save your progress and unlock achievements!</span>
              </AlertDescription>
              
              <div className="flex flex-wrap items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onGuestClick}
                  className="bg-white text-xs sm:text-sm h-8"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  ChooseUsername
                </Button>
                
                <Button
                  size="sm"
                  onClick={onSignInClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm h-8"
                >
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Sign In
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 h-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
