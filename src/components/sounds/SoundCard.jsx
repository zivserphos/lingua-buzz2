import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, Sparkles, Trophy, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { fetchSoundLeaderboard } from '@/components/services/LeaderboardService';
import LeaderboardModal from './LeaderboardModal';
import SocialService from '@/components/services/SocialService';

// Helper function to replace the import
const generateSmallImageUrl = (url) => {
  if (!url) return '';
  if (url.includes('firebasestorage.googleapis.com')) {
    return url.replace('alt=media', 'alt=media&w=400');
  }
  return url;
};

export default function SoundCard({
  sound,
  isAnonymousGuest,
  onInteraction,
  language,
}) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isLiked, setIsLiked] = useState(sound?.isLiked || false);
  const [isSaved, setIsSaved] = useState(sound?.isSaved || false);
  const [likeCount, setLikeCount] = useState(sound?.num_of_likes || 0);
  const [loading, setLoading] = useState(false);
  const [isSquareImage, setIsSquareImage] = useState(false);
  const [leaderboardStats, setLeaderboardStats] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  useEffect(() => {
    if (sound?.image_url) {
      const img = new Image();
      img.onload = () => {
        // If width and height are the same, it's square
        setIsSquareImage(img.width === img.height);
      };
      img.src = sound.image_url;
    }
  }, [sound?.image_url]);

  const soundUrl = `/${language.toLowerCase()}/memesound/${sound.id}`;

  const soundState = {
    soundName: sound.name,
    soundId: sound.id,
    language: language,
  };

  const handleShowLeaderboard = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLeaderboardLoading(true);

      // Fetch leaderboard data from API
      const leaderboardData = await fetchSoundLeaderboard(sound.id);

      // Update state with the returned data
      setLeaderboardStats(leaderboardData.leaderboard || []);
      setShowLeaderboard(true);
    } catch (error) {
      console.error('Error loading sound leaderboard:', error);
      // Show empty leaderboard on error
      setLeaderboardStats([]);
      setShowLeaderboard(true);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAnonymousGuest) {
      onInteraction('like');
      return;
    }

    try {
      setLoading(true);
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

      if (isLiked) {
        await SocialService.unlike('sound', sound.id);
      } else {
        await SocialService.like('sound', sound.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAnonymousGuest) {
      onInteraction('save');
      return;
    }

    try {
      setLoading(true);
      setIsSaved(!isSaved);

      if (isSaved) {
        await SocialService.unsaveSound(sound.id);
      } else {
        await SocialService.saveSound(sound.id);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      setIsSaved(!isSaved); // Revert state on error
    } finally {
      setLoading(false);
    }
  };

  // Update isSaved state when sound prop changes
  useEffect(() => {
    setIsSaved(sound?.isSaved || false);
  }, [sound?.isSaved]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className='group relative'
    >
      <Card className='overflow-hidden bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300'>
        <CardContent className='p-0'>
          {/* Image section with shorter height on desktop */}
          <div className='relative h-40 overflow-hidden'>
            <img
              src={generateSmallImageUrl(sound.image_url)}
              alt={sound.name}
              loading='lazy'
              className={`w-full h-full ${
                isSquareImage ? 'object-fill' : 'object-cover'
              } transition-transform duration-300 group-hover:scale-105`}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            
            {/* "Go Crazy" button - visible on hover */}
            <div className='absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0'>
              <Link
                to={createPageUrl('MemeSound', { sound_id: sound.id })}
                state={soundState}
                className='inline-flex'
              >
                <Button className='bg-purple-600 hover:bg-purple-700' size='sm'>
                  <Sparkles className='w-4 h-4 mr-2' />
                  Go Crazy
                </Button>
              </Link>
            </div>
          </div>

          {/* Sound info section */}
          <div className='p-4 space-y-3'>
            <div className='flex justify-between items-start'>
              <h3 className='font-semibold text-lg leading-tight'>
                {sound.name}
              </h3>
              <div className='flex items-center gap-2'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className={`${
                          isLiked
                            ? 'text-pink-500 bg-pink-50'
                            : 'text-pink-500 hover:text-pink-600'
                        }`}
                        onClick={handleLike}
                        disabled={loading}
                      >
                        <Heart
                          className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
                        />
                        <span className='ml-1'>{likeCount}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isLiked ? 'Unlike' : 'Like'} this sound</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className={`${
                          isSaved
                            ? 'text-yellow-500 bg-yellow-50'
                            : 'text-yellow-500 hover:text-yellow-600'
                        }`}
                        onClick={handleSave}
                        disabled={loading}
                      >
                        <Star
                          className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isSaved ? 'Remove from saved' : 'Save'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  variant='ghost'
                  size='sm'
                  className='text-yellow-500 hover:text-yellow-600'
                  onClick={handleShowLeaderboard}
                  disabled={leaderboardLoading}
                >
                  {leaderboardLoading ? (
                    <span className='w-4 h-4 border-2 border-t-transparent border-yellow-500 rounded-full animate-spin' />
                  ) : (
                    <Trophy className='w-4 h-4' />
                  )}
                </Button>
              </div>
            </div>

            <div className='flex items-center gap-3 text-sm text-gray-600'>
              <div className='flex items-center gap-1'>
                <Flame className='w-4 h-4 text-orange-500' />
                <span>{sound.virality_index}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='w-4 h-4 text-blue-500' />
                <span>{sound.length}s</span>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              {sound.hastags?.slice(0, 3).map((tag, i) => (
                <Badge
                  key={i}
                  variant='secondary'
                  className='bg-purple-100 text-purple-700 hover:bg-purple-200'
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Always show 'Go Crazy' button for mobile and smaller devices */}
            <div className='md:hidden mt-2 mb-2'>
              <Link
                to={createPageUrl('MemeSound', { sound_id: sound.id })}
                state={soundState}
                className='w-full'
              >
                {/* <Button className='w-full bg-purple-600 hover:bg-purple-700' size='sm'>
                  <Sparkles className='w-4 h-4 mr-2' />
                  Go Crazy
                </Button> */}
              </Link>
            </div>

            <audio controls className='w-full mt-3' preload='none'>
              <source src={sound.audio_url} type='audio/mpeg' />
            </audio>
          </div>
        </CardContent>
      </Card>

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        stats={leaderboardStats}
        soundName={sound.name}
      />
    </motion.div>
  );
}
