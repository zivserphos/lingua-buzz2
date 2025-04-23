import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockOpen } from "lucide-react";  // Import the icon you're using

export default function GuestDialog({ 
  open,
  isAnonymousGuest,
  username,
  onOpenChange,
  onUsernameChange,
  onSubmit,
  interactionSource,
  onGoogleSignIn // Add a new prop for Google Sign-In
}) {
  // Get contextual message based on interaction type
  const getContextualMessage = () => {
    if (!interactionSource) return "Choose a username to save your progress";
    
    switch(interactionSource) {
      case 'like':
        return "Choose a username to like sounds and track your favorites";
      case 'save':
        return "Create a username to save sounds to your collection";
      case 'comment':
        return "Create a username to join the conversation";
      default:
        return "Choose a username to unlock more features";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isAnonymousGuest ? "Save your progress" : "Choose a username"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter a username"
              value={username}
              onChange={onUsernameChange}
            />
          </div>
          <p className="text-sm text-gray-500">
            {getContextualMessage()}
          </p>
          {interactionSource && (
            <div className="bg-purple-50 p-3 rounded-md text-sm">
              <div className="flex items-center gap-2 text-purple-700 font-medium mb-1">
                <LockOpen className="h-4 w-4" />
                <span>You'll unlock:</span>
              </div>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Save favorite sounds</li>
                <li>Track listening history</li>
                <li>Earn achievements and rewards</li>
                {interactionSource === 'save' && <li>Create custom playlists</li>}
                {interactionSource === 'comment' && <li>Join community discussions</li>}
              </ul>
            </div>
          )}
          
          {/* Divider with "or" text */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
          
          {/* Google Sign-In Button */}
          <Button 
            type="button"
            variant="outline"
            onClick={() => {
              onGoogleSignIn();
              onOpenChange(false); // Close dialog after clicking
            }}
            className="w-full flex items-center justify-center gap-2 border-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
              <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/>
              <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
              <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            Sign in with Google
          </Button>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!username || username.trim() === ''}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
          >
            {isAnonymousGuest ? "Save Progress" : "Continue as Guest"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
