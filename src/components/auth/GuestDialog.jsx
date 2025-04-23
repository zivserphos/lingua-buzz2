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
  interactionSource
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
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!username || username.trim() === ''}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isAnonymousGuest ? "Save Progress" : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
