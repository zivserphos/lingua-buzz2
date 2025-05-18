import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuestDialog({
  open,
  isAnonymousGuest,
  username,
  onOpenChange,
  onUsernameChange,
  onSubmit,
  interactionSource,
  onGoogleSignIn,
}) {
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md p-4 sm:p-6 w-[95%] mx-auto rounded-xl'>
        {/* Add these styles for better mobile appearance */}
        <style jsx>{`
          @media (max-width: 640px) {
            .DialogTitle {
              font-size: 1.25rem !important;
              text-align: center !important;
              margin-bottom: 0.5rem !important;
            }

            input {
              height: 44px !important;
            }
          }
        `}</style>
        <DialogHeader className='space-y-3 text-center sm:text-left'>
          <DialogTitle className='text-xl sm:text-2xl'>
            {isAnonymousGuest ? 'Update Username' : 'Choose a Username'}
          </DialogTitle>
          <DialogDescription className='text-sm sm:text-base'>
            {isAnonymousGuest
              ? 'Change your guest username to something more memorable.'
              : 'Pick a username to track your progress.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 mt-2'>
          <div className='space-y-2'>
            <Input
              type='text'
              value={username}
              onChange={onUsernameChange}
              placeholder='Enter username'
              className='h-10 sm:h-12'
              required
              autoFocus
              maxLength={20}
            />
            <p className='text-xs text-gray-500'>
              This will be displayed next to your activity.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 pt-2'>
            <Button
              type='submit'
              className='w-full bg-purple-600 hover:bg-purple-700'
            >
              <Save className='w-4 h-4 mr-2' />
              {isAnonymousGuest ? 'Update Username' : 'Save Username'}
            </Button>
          </div>
        </form>

        {interactionSource && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-4 bg-purple-50 p-3 rounded-lg'
          >
            <h4 className='font-medium text-sm text-purple-800 mb-1'>
              Want more features?
            </h4>
            <ul className='text-xs text-purple-700 space-y-1 pl-5 list-disc'>
              <li>Save favorite sounds</li>
              <li>Track listening history</li>
              <li>Earn achievements</li>
              {interactionSource === 'save' && <li>Create custom playlists</li>}
              {interactionSource === 'comment' && (
                <li>Join community discussions</li>
              )}
            </ul>
          </motion.div>
        )}

        <div className='relative my-4'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>or</span>
          </div>
        </div>

        <Button
          onClick={onGoogleSignIn}
          className='w-full flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-300'
          type='button'
        >
          <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
            <path
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              fill='#4285F4'
            />
            <path
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              fill='#34A853'
            />
            <path
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              fill='#FBBC05'
            />
            <path
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              fill='#EA4335'
            />
          </svg>
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
