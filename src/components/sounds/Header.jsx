import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  LogIn,
  LogOut,
  Menu,
  Trophy,
  Star,
  User,
  Loader2,
  BookOpen,
  Shuffle,
} from 'lucide-react';

export default function Header({
  user,
  isAnonymousGuest,
  authLoading,
  onGuestClick,
  onSignInClick,
  onSignOutClick,
}) {
  return (
    <div className='mb-8'>
      {/* Mobile header with hamburger menu */}
      <div className='sm:hidden'>
        <div className='flex flex-col items-start gap-4'>
          {/* Title section with mobile menu */}
          <div className='flex items-start gap-3 w-full'>
            <div className='mt-1'>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant='outline' size='icon' className='h-9 w-9'>
                    <Menu className='h-5 w-5' />
                    <span className='sr-only'>Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side='left' className='w-[80%] max-w-sm'>
                  <div className='flex flex-col space-y-4 mt-8 px-2'>
                    <div className='mb-6'>
                      <h2 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                        Brainrot Memes
                      </h2>
                      <p className='text-sm text-gray-500'>Navigation</p>
                    </div>

                    <Link
                      to='/blog'
                      className='flex items-center space-x-2 p-3 rounded hover:bg-gray-100'
                    >
                      <BookOpen className='w-5 h-5 text-purple-500' />
                      <span>Blog</span>
                    </Link>

                    <Link
                      to='/randombrainrot'
                      className='flex items-center space-x-2 p-3 rounded hover:bg-gray-100'
                    >
                      <Shuffle className='w-5 h-5 text-orange-500' />
                      <span>Random Brainrot</span>
                    </Link>

                    <Link
                      to='/savedsounds'
                      className='flex items-center space-x-2 p-3 rounded hover:bg-gray-100'
                    >
                      <Star className='w-5 h-5 text-yellow-500' />
                      <span>Saved Sounds</span>
                    </Link>

                    <Link
                      to='/leaderboard'
                      className='flex items-center space-x-2 p-3 rounded hover:bg-gray-100'
                    >
                      <Trophy className='w-5 h-5 text-yellow-500' />
                      <span>Leaderboard</span>
                    </Link>

                    <div className='h-px bg-gray-200 my-4'></div>

                    {/* Auth buttons remain unchanged */}
                    {!isAnonymousGuest && user ? (
                      <Button
                        onClick={onSignOutClick}
                        className='bg-red-600 hover:bg-red-700 mt-2 h-11'
                        disabled={authLoading}
                      >
                        {authLoading ? (
                          <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                        ) : (
                          <LogOut className='w-5 h-5 mr-2' />
                        )}
                        Sign Out
                      </Button>
                    ) : (
                      <div className='flex flex-col gap-3 mt-2'>
                        <Button
                          onClick={onGuestClick}
                          variant='outline'
                          className='bg-white w-full h-11'
                          disabled={authLoading}
                        >
                          <User className='w-5 h-5 mr-2' />
                          Save Progress
                        </Button>

                        <Button
                          onClick={onSignInClick}
                          className='bg-purple-600 hover:bg-purple-700 w-full h-11'
                          disabled={authLoading}
                        >
                          {authLoading ? (
                            <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                          ) : (
                            <LogIn className='w-5 h-5 mr-2' />
                          )}
                          Sign In
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Brainrot Hottest Memes 🔥
              </h1>
              <p className='text-sm text-gray-600 mt-1'>
                Go crazy with looping brainrot meme sounds with funny effects
              </p>
            </div>
          </div>

          {/* Mobile-only bottom buttons remain unchanged */}
          <div className='flex flex-wrap gap-2 w-full justify-between mt-2'>
            {/* Auth buttons unchanged */}
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className='hidden sm:flex sm:flex-col md:flex-row justify-between items-center gap-4'>
        <div>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
            Brainrot Hottest Memes 🔥
          </h1>
          <p className='text-gray-600 mt-2'>
            Go crazy with looping brainrot meme sounds with funny effects
          </p>
        </div>

        <div className='flex items-center gap-4 flex-wrap justify-center'>
          <Link to='/blog'>
            <Button variant='outline' className='bg-white/50 backdrop-blur-sm'>
              <BookOpen className='w-5 h-5 mr-2 text-purple-500' />
              Blog
            </Button>
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to='/randombrainrot'>
                  <Button
                    variant='outline'
                    className='bg-white/50 backdrop-blur-sm'
                  >
                    <Shuffle className='w-5 h-5 mr-2 text-orange-500' />
                    Random Brainrot
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Watch random brainrot videos!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {user && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to='/savedsounds'>
                      <Button
                        variant='outline'
                        className='bg-white/50 backdrop-blur-sm'
                      >
                        <Star className='w-5 h-5 mr-2 text-yellow-500' />
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
                    <Link to='/leaderboard'>
                      <Button
                        variant='outline'
                        className='bg-white/50 backdrop-blur-sm'
                      >
                        <Trophy className='w-5 h-5 mr-2 text-yellow-500' />
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
              className='bg-red-600 hover:bg-red-700'
              disabled={authLoading}
            >
              {authLoading ? (
                <Loader2 className='w-5 h-5 mr-2 animate-spin' />
              ) : (
                <>
                  <LogOut className='w-5 h-5 mr-2' />
                  Sign Out
                </>
              )}
            </Button>
          ) : (
            <div className='flex gap-2'>
              <Button
                onClick={onGuestClick}
                variant='outline'
                className='bg-white/50 backdrop-blur-sm'
                disabled={authLoading}
              >
                <User className='w-5 h-5 mr-2' />
                Save Progress
              </Button>

              <Button
                onClick={onSignInClick}
                className='bg-purple-600 hover:bg-purple-700'
                disabled={authLoading}
              >
                {authLoading ? (
                  <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                ) : (
                  <>
                    <LogIn className='w-5 h-5 mr-2' />
                    Sign In
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
