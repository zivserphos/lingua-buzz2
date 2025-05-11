import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import ImageUpload from './ImageUpload';
import { motion } from "framer-motion";

export default function ProfileDialog({ open, onOpenChange, userData, onProfileUpdated }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Using profileImage property from userData */}
            <ImageUpload 
              currentImageUrl={userData?.profileImage}
              onImageUpdated={() => {
                onProfileUpdated?.();
                // Optionally close the dialog after successful update
                // onOpenChange(false);
              }}
            />

            <div className="text-center">
              <h3 className="font-medium">{userData?.full_name || userData?.email}</h3>
              <p className="text-sm text-gray-500">{userData?.email}</p>
            </div>

            {/* Add any additional profile settings here */}
            <div className="w-full space-y-4">
              <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-700">
                <p>Customize your profile by updating your picture!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
