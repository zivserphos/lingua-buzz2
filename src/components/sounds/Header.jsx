import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { LogIn, LogOut, Trophy, Star, User, Loader2 } from "lucide-react";

export default function Header({
  user,
  isAnonymousGuest,
  authLoading,
  onGuestClick,
  onSignInClick,
  onSignOutClick
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Brainrot Hottest Memes 🔥
        </h1>
        <p className="text-gray-600 mt-2">Go crazy with looping brainrot meme sounds with funny effects</p>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={createPageUrl("SavedSounds")}>
                    <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      Saved
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isAnonymousGuest && (
                  <TooltipContent>
                    <p>Sign in to save your favorite sounds!</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={createPageUrl("Leaderboard")}>
                    <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Leaderboard
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isAnonymousGuest && (
                  <TooltipContent>
                    <p>Sign in to track your achievements!</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        {!isAnonymousGuest && user ? (
          <Button 
            onClick={onSignOutClick}
            className="bg-red-600 hover:bg-red-700"
            disabled={authLoading}
          >
            {authLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <>
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={onGuestClick}
              variant="outline"
              className="bg-white/50 backdrop-blur-sm"
              disabled={authLoading}
            >
              <User className="w-5 h-5 mr-2" />
              Save Progress
            </Button>
            
            <Button 
              onClick={onSignInClick} 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={authLoading}
            >
              {authLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
