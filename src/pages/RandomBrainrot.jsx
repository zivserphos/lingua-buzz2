import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Shuffle,
  Loader2,
  SkipForward,
  Volume2,
  VolumeX,
  Share,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import SharePopup from '../components/sounds/SharePopup';
import { Helmet } from 'react-helmet-async';
import { brainrotYoutubeUrls } from '@/components/randombrainrot/brainrotUrls';

// Create video objects from the imported YouTube URLs
const brainrotVideos = brainrotYoutubeUrls.map(url => {
  // Extract video ID from YouTube URL
  const videoId = url.split('/').pop().split('?')[0];
  return {
    id: videoId,
    title: 'Viral Brainrot Video',
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    source: 'YouTube'
  };
});

// Function to get a truly random element from array
const getRandomVideo = (currentId = null) => {
  if (brainrotVideos.length === 0) return null;
  if (
    brainrotVideos.length === 1 &&
    currentId &&
    brainrotVideos[0].id === currentId
  )
    return brainrotVideos[0]; // Only one video, return it
  if (brainrotVideos.length === 1) return brainrotVideos[0];

  const availableVideos = currentId
    ? brainrotVideos.filter((video) => video.id !== currentId)
    : brainrotVideos;

  if (availableVideos.length === 0)
    return brainrotVideos[Math.floor(Math.random() * brainrotVideos.length)]; // Fallback if filtering removes all

  const randomIndex = Math.floor(Math.random() * availableVideos.length);
  return availableVideos[randomIndex];
};

export default function RandomBrainrotPage() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [likedVideos, setLikedVideos] = useState(() => {
    const saved = localStorage.getItem('likedBrainrotVideos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (brainrotVideos.length > 0 && !currentVideo) {
      loadRandomVideo();
    } else if (brainrotVideos.length === 0) {
      setCurrentVideo({
        id: 'placeholder',
        title: 'No Videos Available',
        embedUrl: '',
        source: 'System',
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('likedBrainrotVideos', JSON.stringify(likedVideos));
  }, [likedVideos]);

  const loadRandomVideo = () => {
    if (brainrotVideos.length === 0) {
      setCurrentVideo({
        id: 'placeholder',
        title: 'No videos available',
        embedUrl: '',
        source: 'System',
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newVideo = getRandomVideo(currentVideo?.id);
      setCurrentVideo(newVideo);
      setLoading(false);
    }, 800);
  };

  const toggleLike = () => {
    if (!currentVideo || currentVideo.id === 'placeholder') return;

    if (likedVideos.includes(currentVideo.id)) {
      setLikedVideos(likedVideos.filter((id) => id !== currentVideo.id));
    } else {
      setLikedVideos([...likedVideos, currentVideo.id]);
    }
  };

  const isVideoLiked =
    currentVideo &&
    currentVideo.id !== 'placeholder' &&
    likedVideos.includes(currentVideo.id);

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6'>
      <Helmet>
        <title>Random Brainrot Videos | Brainrot Memes</title>
        <meta
          name='description'
          content='Watch random viral brainrot videos and audio memes. Discover hilarious, trending brainrot content and share with friends.'
        />
        <meta
          property='og:title'
          content='Random Brainrot Videos | Brainrot Memes'
        />
        <meta
          property='og:description'
          content='Watch random viral brainrot videos and audio memes. Discover hilarious, trending brainrot content and share with friends.'
        />
        <meta property='og:type' content='website' />
        <meta
          property='og:url'
          content='https://brainrot-memes.com/randombrainrot'
        />
        <meta
          property='og:image'
          content='https://brainrot-memes.com/images/brainrot-social-preview.jpg'
        />
        <meta name='twitter:card' content='summary_large_image' />
        <link
          rel='canonical'
          href='https://brainrot-memes.com/randombrainrot'
        />
      </Helmet>

      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <Link to='/sounds'>
            <Button
              variant='ghost'
              size='sm'
              className='flex items-center gap-2 text-gray-700 hover:text-gray-900'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Sounds
            </Button>
          </Link>
        </div>

        <Card className='bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden'>
          <CardHeader className='text-center'>
            <div className='flex justify-center items-center gap-2 mb-2'>
              <Shuffle className='w-8 h-8 text-purple-600' />
              <CardTitle className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Random Brainrot
              </CardTitle>
            </div>
            <CardDescription className='text-gray-600'>
              Press the button to experience random viral brainrot videos from around the web.
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6 p-6'>
            <AnimatePresence mode='wait'>
              {currentVideo && !loading && currentVideo.embedUrl && (
                <motion.div
                  key={currentVideo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className='aspect-w-16 aspect-h-9'
                >
                  <div className='rounded-xl overflow-hidden shadow-xl border-4 border-purple-200'>
                    <iframe
                      src={`${currentVideo.embedUrl}${
                        currentVideo.embedUrl.includes('?') ? '&' : '?'
                      }autoplay=1${muted ? '&mute=1' : ''}`}
                      title={currentVideo.title}
                      className='w-full aspect-video'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div className='mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <h3 className='font-bold text-xl text-gray-800'>
                      {currentVideo.title}
                    </h3>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setMuted(!muted)}
                        className='flex items-center gap-1'
                      >
                        {muted ? (
                          <VolumeX className='w-4 h-4' />
                        ) : (
                          <Volume2 className='w-4 h-4' />
                        )}{' '}
                        {muted ? 'Unmute' : 'Mute'}
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={toggleLike}
                        className={`flex items-center gap-1 ${
                          isVideoLiked
                            ? 'text-pink-500 bg-pink-50 border-pink-200'
                            : ''
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isVideoLiked ? 'fill-current' : ''
                          }`}
                        />{' '}
                        {isVideoLiked ? 'Liked' : 'Like'}
                      </Button>
                      {/* <SharePopup
                        sound={{
                          name: 'Viral Brainrot Video',
                          image_url: `https://img.youtube.com/vi/${currentVideo.id}/hqdefault.jpg`,
                        }}
                        trigger={
                          <Button
                            variant='outline'
                            size='sm'
                            className='flex items-center gap-1'
                          >
                            <Share className='w-4 h-4' /> Share
                          </Button>
                        }
                      /> */}
                    </div>
                  </div>
                </motion.div>
              )}
              {currentVideo && !loading && !currentVideo.embedUrl && (
                <motion.div className='text-center py-10'>
                  <p className='text-lg font-semibold text-red-500'>
                    {currentVideo.title}
                  </p>
                  <p className='text-gray-600'>
                    Please check your internet connection or try again later.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='flex flex-col items-center justify-center py-16'
                >
                  <Loader2 className='w-12 h-12 text-purple-600 animate-spin' />
                  <p className='mt-4 text-gray-500'>
                    Loading random brainrot...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className='flex justify-center pt-4 border-t'>
              <Button
                onClick={loadRandomVideo}
                disabled={loading || brainrotVideos.length === 0}
                className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-3 px-8'
              >
                {loading ? (
                  <>
                    <Loader2 className='w-5 h-5 mr-2 animate-spin' /> Loading...
                  </>
                ) : (
                  <>
                    <SkipForward className='w-5 h-5 mr-2' /> Next Random
                    Brainrot
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
