import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Upload, Camera, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";

export default function ImageUpload({ currentImageUrl, onImageUpdated }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    // Update preview if currentImageUrl changes
    if (currentImageUrl) {
      setPreview(currentImageUrl);
    }
  }, [currentImageUrl]);

  const generateSignedUrl = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(
        'https://generateprofileimagesignedurl-stbfcg576q-uc.a.run.app',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              contentType: 'image/jpeg'
            }
          })
        }
      );

      if (!response.ok) throw new Error('Failed to generate upload URL');
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  };

  const updateProfileImage = async (filePath) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication required');

      // Extract USER_UID and TIMESTAMP from filePath
      const matches = filePath.match(/users_profile_images\/(.+?)_(\d+)\.jpeg/);
      if (!matches) throw new Error('Invalid file path format');

      const [, userUid, timestamp] = matches;

      const profileImageUrl = `https://firebasestorage.googleapis.com/v0/b/meme-soundboard-viral-alarm.firebasestorage.app/o/users_profile_images%2F${userUid}_${timestamp}.jpeg?alt=media`;

      const response = await fetch(
        'https://updateprofileimageforuser-stbfcg576q-uc.a.run.app',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              profileImageUrl
            }
          })
        }
      );

      if (!response.ok) throw new Error('Failed to update profile image');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setShowConfirm(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get signed URL
      const { uploadUrl, filePath } = await generateSignedUrl();

      // Upload file
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg'
        },
        body: selectedFile
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload image');

      // Update profile with new image
      await updateProfileImage(filePath);

      // Show success state
      setUploadSuccess(true);
      if (onImageUpdated) onImageUpdated();

      // Reset after 2 seconds
      setTimeout(() => {
        setShowConfirm(false);
        setUploadSuccess(false);
        setPreview(null);
        setSelectedFile(null);
      }, 2000);

    } catch (error) {
      console.error('Error uploading image:', error);
      setError((error).message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Avatar className="w-24 h-24 ring-2 ring-offset-2 ring-purple-200">
            <AvatarImage src={preview || currentImageUrl} />
            <AvatarFallback>
              <Camera className="w-8 h-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <Camera className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <Button
          variant="outline"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className="relative overflow-hidden"
        >
          <Upload className="w-4 h-4 mr-2" />
          Change Profile Picture
          {loading && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}
        </Button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Profile Picture</AlertDialogTitle>
            <AlertDialogDescription>
              {uploadSuccess ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  Profile picture updated successfully!
                </div>
              ) : (
                "Are you sure you want to update your profile picture?"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {preview && !uploadSuccess && (
            <div className="relative w-48 h-48 mx-auto my-4 rounded-full overflow-hidden">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <AlertDialogFooter>
            {!uploadSuccess && (
              <>
                <AlertDialogCancel 
                  disabled={loading}
                  onClick={() => {
                    setPreview(null);
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={loading}
                  onClick={handleUpload}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Update Picture'
                  )}
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
