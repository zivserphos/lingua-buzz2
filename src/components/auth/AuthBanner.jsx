import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCheck, Save, LogIn, X } from "lucide-react";

export default function AuthBanner({ show, onGuestClick, onSignInClick, onClose }) {
  return (
    <AnimatePresence>
      {show && (
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
                  onClick={onGuestClick}
                  className="bg-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Choose Username
                </Button>
                
                <Button
                  size="sm"
                  onClick={onSignInClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
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
  );
}
