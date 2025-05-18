import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Clock,
  Download,
  FastForward,
  Loader2,
  PlayCircle,
  PauseCircle,
  RotateCw,
  Volume2,
  VolumeX,
  Trophy,
  AlertCircle,
  Star,
  Sparkles,
} from 'lucide-react';
import useStatsApplier from '@/hooks/stats-applier';
import LeaderboardModal from '../components/sounds/LeaderboardModal';
import { fetchSoundLeaderboard } from '../components/services/LeaderboardService';
import SocialSection from '../components/sounds/SocialSection';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AdvancedSettings from '../components/sounds/AdvancedSettings';
import useAuth from '@/hooks/useAuth';
import GuestDialog from '@/components/auth/GuestDialog';
import {
  getLocalizedDescription,
  generateSoundStructuredData,
  generateMetaTags,
  generateHreflangTags,
  getEngagementPrompts,
} from '@/utils/languagesSeo';

// Firebase config reference
const firebaseConfig = {
  apiKey: 'AIzaSyDd5pPm43-tcWYQiWnVQPCppnByOZw4Ufo',
};

export default function MemeSoundPage() {
  const {
    user,
    idToken,
    authLoading,
    isAnonymousGuest,
    showAuthBanner,
    showGuestDialog,
    guestUsername,
    handleGoogleSignIn,
    handleGuestDialogOpen,
    handleGuestSignIn,
    handleSignOut,
    setShowAuthBanner,
    setShowGuestDialog,
    setGuestUsername,
  } = useAuth();

  const [interactionSource, setInteractionSource] = useState(null);

  // Get URL parameters
  const params = useParams();
  const location = useLocation();
  const currentLanguage = params.language || 'English';

  const handleSocialInteraction = (interactionType) => {
    console.log(`Social interaction attempted: ${interactionType}`);
    setInteractionSource(interactionType);
    handleGuestDialogOpen();
  };

  // The parameter might be a name or an ID
  const { name } = params;
  const decodedName = name ? decodeURIComponent(name) : '';

  // Get additional data from state if available
  const soundId =
    params.sound_id || location.state?.soundId || location.state?.sound_id;
  const soundName = location.state?.soundName || '';

  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  // Leaderboard state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardStats, setLeaderboardStats] = useState([]);

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [echoCount, setEchoCount] = useState(0);
  const [isConfigLocked, setIsConfigLocked] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  // Voice changing state
  const [voiceChangedAudioUrl, setVoiceChangedAudioUrl] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Audio refs
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioSourcesRef = useRef([]);
  const audioBufferRef = useRef(null);
  const gainNodeRef = useRef(null);
  const playbackStateRef = useRef(false); // Track playback state in a ref too

  // Utility functions
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const {
    elapsedTime,
    statsUpdated,
    updatingStats,
    formattedTime,
    canApplyStats,
    isEligibleUser,
    applyStats,
    startTimer,
    stopTimer,
    reset: resetStats,
  } = useStatsApplier({
    soundId: sound?.id,
    language: sound?.language || currentLanguage,
    effectUsed: echoCount > 0 ? `echo_${echoCount}` : null,
  });

  // Fetch leaderboard data
  const handleShowLeaderboard = async () => {
    try {
      if (!sound?.id) {
        console.error('Sound ID is required');
        return;
      }

      setLoading(true);
      const leaderboardData = await fetchSoundLeaderboard(sound.id);
      setLeaderboardStats(leaderboardData.leaderboard || []);
      setShowLeaderboard(true);
    } catch (error) {
      console.error('Error loading sound leaderboard:', error);
      setLeaderboardStats([]);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clean up session on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem('current_session_id');
    };
  }, []);

  // Check for required sound info
  useEffect(() => {
    if (!soundId && !soundName) {
      setError(
        'Sound information required. Please select a sound from the main page.'
      );
      setLoading(false);
    }
  }, []);

  // Stop timer when playback stops
  useEffect(() => {
    if (!isPlaying) {
      stopTimer();
    }
  }, [isPlaying]);

  // Token refresh
  useEffect(() => {
    const tokenRefreshInterval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await refreshAccessToken(refreshToken);
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  // Fetch sound details on mount
  useEffect(() => {
    fetchSoundDetails();
    return () => {
      stopAllAudioSources();
    };
  }, [soundId, soundName, decodedName, currentLanguage]);

  // Set up audio when sound changes
  useEffect(() => {
    if (audioRef.current && sound?.audio_url) {
      audioRef.current.src = sound.audio_url;
      audioRef.current.load();
      preloadAudioBuffer(sound.audio_url);
    }

    return () => {
      stopAllAudioSources();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [sound?.audio_url]);

  // Update playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }

    audioSourcesRef.current.forEach((source) => {
      if (source && source.playbackRate) {
        source.playbackRate.value = playbackRate;
      }
    });
  }, [playbackRate]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Preload audio buffer for Web Audio API
  const preloadAudioBuffer = async (url) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        console.log('Created new AudioContext');
      }

      console.log('Fetching audio buffer...');
      const response = await fetch(url);
      console.log('Audio fetch complete, decoding...');
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      if (audioBuffer) {
        audioBufferRef.current = audioBuffer;
        console.log('Audio buffer loaded successfully, duration:', audioBuffer.duration);
      } else {
        console.error('Audio buffer appears empty');
      }
    } catch (err) {
      console.error('Error preloading audio buffer:', err);
    }
  };

  // Function to refresh token if needed
  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status}`);
      }

      const data = await response.json();
      if (!data.id_token) {
        throw new Error('Token refresh response missing id_token');
      }

      localStorage.setItem('access_token', data.id_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }

      return data.id_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  // Fetch sound details
  const fetchSoundDetails = async (retryCount = 0) => {
    if (!soundId && !soundName && !decodedName) {
      setError('Sound information required. Please select a sound from the main page.');
      setLoading(false);
      return;
    }

    if (retryCount > 2) {
      setError('Failed after multiple attempts. Please try again later.');
      setLoading(false);
      return;
    }

    if (!navigator.onLine) {
      setError('You appear to be offline. Please check your connection.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      let accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          accessToken = await refreshAccessToken(refreshToken);
        }
      }

      const searchTerm = soundId || soundName || decodedName;

      const searchResponse = await fetch(
        'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net/getAllSoundsMetadata',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({
            language: currentLanguage,
            limit: 50,
            page: 1,
            search: searchTerm,
          }),
        }
      );

      if (searchResponse.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const newToken = await refreshAccessToken(refreshToken);
          if (newToken) {
            return fetchSoundDetails(retryCount + 1);
          }
        }
        throw new Error('Authentication required. Please log in.');
      }

      if (!searchResponse.ok) {
        throw new Error(`HTTP error! status: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();

      if (!searchData.result?.success || !searchData.result.data?.length) {
        throw new Error(`Sound "${searchTerm}" not found`);
      }

      if (soundId) {
        const exactMatch = searchData.result.data.find((s) => s.id === soundId);
        if (exactMatch) {
          setSound(exactMatch);
          setLoading(false);
          setIsSaved(exactMatch.isSaved || false);
          return;
        }
      }

      let bestMatch = null;

      if (params.sound_id) {
        bestMatch = searchData.result.data.find(
          (sound) =>
            sound.id.includes(params.sound_id) ||
            sound.name.toLowerCase().includes(params.sound_id.toLowerCase())
        );
      }

      if (!bestMatch && searchData.result.data.length > 0) {
        bestMatch = searchData.result.data[0];
      }

      if (bestMatch) {
        setSound(bestMatch);
        setLoading(false);
        setIsSaved(bestMatch.isSaved || false);
      } else {
        throw new Error(`Sound "${searchTerm}" not found`);
      }
    } catch (err) {
      console.error('Error fetching sound:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Toggle save status
  const handleToggleSave = async () => {
    if (isAnonymousGuest) {
      handleSocialInteraction('save');
      return;
    }

    try {
      setLoading(true);
      setIsSaved(!isSaved);

      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Authentication required');
        return;
      }

      const endpoint = isSaved
        ? 'https://unsavesound-stbfcg576q-uc.a.run.app'
        : 'https://savesound-stbfcg576q-uc.a.run.app';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            soundId: sound.id,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isSaved ? 'unsave' : 'save'} sound`);
      }

      const data = await response.json();
      if (!data.result?.success) {
        throw new Error(
          data.result?.error || `Failed to ${isSaved ? 'unsave' : 'save'} sound`
        );
      }
    } catch (error) {
      console.error('Error toggling save state:', error);
      setIsSaved(isSaved);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Audio control functions
  const stopAllAudioSources = () => {
    try {
      audioSourcesRef.current.forEach((source) => {
        if (source && typeof source.stop === 'function') {
          try {
            source.stop();
          } catch (e) {
            // Ignore errors if already stopped
          }
        }
      });
      audioSourcesRef.current = [];
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch (err) {
      console.error('Error stopping audio sources:', err);
    }
  };

  // Play with Web Audio API and echo effect
  const playWithEcho = async () => {
    if (!sound?.audio_url || !audioBufferRef.current) {
      console.error('Audio not available or not loaded');
      return;
    }

    try {
      // Ensure AudioContext is ready
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        await preloadAudioBuffer(sound.audio_url);
      }

      if (audioContextRef.current.state === 'suspended') {
        try {
          await audioContextRef.current.resume();
        } catch (err) {
          console.error('Failed to resume AudioContext:', err);
          throw new Error('Could not activate audio playback. Please try clicking play again.');
        }
      }

      // Use simpler approach for mobile with high echo counts
      const useSimplifiedApproach = isMobileDevice() && echoCount > 2;
      
      // Create gain node
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      // Clear existing sources
      stopAllAudioSources();

      if (useSimplifiedApproach) {
        console.log('Using simplified echo for mobile');
        // Create single source with delay for mobile
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.playbackRate.value = playbackRate;
        
        // Create delay to simulate echo
        const delay = audioContextRef.current.createDelay(2.0);
        delay.delayTime.value = 0.1 * echoCount; 
        
        // Create feedback for echo
        const feedback = audioContextRef.current.createGain();
        feedback.gain.value = 0.3; 
        
        // Connect the nodes to create feedback loop
        source.connect(gainNodeRef.current);
        source.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(gainNodeRef.current);
        
        source.loop = isLooping;
        source.start(0);
        audioSourcesRef.current.push(source);
        
        source.onended = () => {
          if (!isLooping && playbackStateRef.current) {
            setIsPlaying(false);
            playbackStateRef.current = false;
            stopAllAudioSources();
            stopTimer();
          }
        };
        
        return;
      }
      
      // Regular approach for desktop or simple mobile cases
      let instanceCount;
      if (isMobileDevice()) {
        instanceCount = echoCount === 0 ? 1 : echoCount;
        instanceCount = Math.min(instanceCount, 5);
      } else {
        instanceCount = echoCount === 0 ? 1 : echoCount * 4;
        instanceCount = Math.min(instanceCount, 20);
      }
      
      console.log(`Playing with ${instanceCount} instances on ${isMobileDevice() ? 'mobile' : 'desktop'}`);
      
      for (let i = 0; i < instanceCount; i++) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.playbackRate.value = playbackRate;
        
        // Set pan and detune
        let pan = 0;
        let detune = 0;
        
        if (i > 0) {
          pan = Math.sin((i / instanceCount) * Math.PI * 2) * 0.8;
          detune = (i / instanceCount) * 100 - 50;
        }
        
        // Create panner with fallback
        let panner;
        try {
          panner = audioContextRef.current.createStereoPanner();
          panner.pan.value = pan;
        } catch (e) {
          console.log('StereoPanner not supported, using fallback');
          panner = audioContextRef.current.createGain();
        }
        
        // Set detune
        source.detune.value = detune;
        
        // Connect nodes
        source.connect(panner);
        panner.connect(gainNodeRef.current);
        
        // Set loop
        source.loop = isLooping;
        
        // Start playback
        source.start(0);
        
        // Save reference
        audioSourcesRef.current.push(source);
        
        // Add onended handler
        if (i === 0) {
          source.onended = () => {
            if (!isLooping && playbackStateRef.current) {
              setIsPlaying(false);
              playbackStateRef.current = false;
              stopAllAudioSources();
              stopTimer();
            }
          };
        }
      }
    } catch (err) {
      console.error('Error playing with echo:', err);
      setError('Could not play audio with echo effect: ' + err.message);
      
      // Fallback to standard audio
      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (e) {
          console.error('Fallback audio failed:', e);
        }
      }
    }
  };

  // Toggle play/pause
  const togglePlay = async () => {
    const playButton = document.querySelector('[data-play-button]');
    
    if (playButton) {
      playButton.disabled = true;
      setTimeout(() => {
        if (playButton) playButton.disabled = false;
      }, 500);
    }
    
    try {
      if (isPlaying) {
        // STOP PLAYBACK
        console.log('Stopping playback');
        setIsPlaying(false);
        playbackStateRef.current = false;
        
        stopAllAudioSources();
        stopTimer();
      } else {
        // START PLAYBACK
        console.log('Starting playback');
        
        // Ensure context is ready
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          try {
            await audioContextRef.current.resume();
          } catch (err) {
            console.error('Failed to resume AudioContext:', err);
          }
        }
        
        // Reset any error state
        setError(null);
        
        // Start playback
        await handlePlay();
        startTimer();
        setIsPlaying(true);
        playbackStateRef.current = true;
      }
    } catch (err) {
      console.error('Toggle play error:', err);
      setError('Playback error: ' + err.message);
      setIsPlaying(false);
      playbackStateRef.current = false;
    } finally {
      if (playButton) playButton.disabled = false;
    }
  };

  const handleApplyStats = async () => {
    await applyStats();
  };

  const handlePlaybackRateChange = (e) => {
    const value = parseFloat(e.target.value);
    setPlaybackRate(value);
    if (audioRef.current) {
      audioRef.current.playbackRate = value;
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);

    if (audioRef.current) {
      audioRef.current.muted = newMuteState;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newMuteState ? 0 : volume;
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    
    if (audioRef.current) {
      audioRef.current.volume = value;
      if (value === 0 && !isMuted) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (value > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : value;
    }
  };

  const toggleLoop = () => {
    const newLoopState = !isLooping;
    setIsLooping(newLoopState);

    if (audioRef.current) {
      audioRef.current.loop = newLoopState;
    }

    audioSourcesRef.current.forEach((source) => {
      if (source) {
        source.loop = newLoopState;
      }
    });
  };

  const handleDownload = () => {
    if (!sound?.audio_url) {
      console.error('No audio URL available for download');
      return;
    }

    fetch(sound.audio_url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sound.name || 'meme-sound'}.mp3`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error('Error downloading audio:', error);
      });
  };

  // Restart playback when echo settings change
  useEffect(() => {
    if (isPlaying && !isConfigLocked) {
      const restartPlayback = async () => {
        stopAllAudioSources();
        
        // Small delay to ensure everything stops properly
        await new Promise((resolve) => setTimeout(resolve, 50));

        if (echoCount > 0) {
          await playWithEcho();
        } else if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current
            .play()
            .catch((err) => console.error('Error restarting audio:', err));
        }
      };

      restartPlayback();
    }
  }, [echoCount]);

  // Voice change handlers
  const handleVoiceChange = (newAudioUrl) => {
    setVoiceChangedAudioUrl(newAudioUrl);
    setProcessing(false);
  };

  const prepareVoiceProcessing = () => {
    setProcessing(true);
  };

  const handlePlay = async () => {
    const audioUrl = voiceChangedAudioUrl || sound?.audio_url;
    if (!audioUrl) return;

    if (echoCount > 0) {
      // Use Web Audio API for echo effect
      await playWithEcho();
    } else {
      // Use regular HTML Audio element for normal playback
      if (audioRef.current) {
        try {
          audioRef.current.src = audioUrl;
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
        } catch (err) {
          console.error('Error playing audio:', err);
          setError('Could not play audio: ' + err.message);
          throw err;
        }
      }
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='w-10 h-10 animate-spin text-purple-600' />
      </div>
    );
  }

  if (error || !sound) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600'>Error</h2>
          <p className='text-gray-600 mt-2'>{error || 'Sound not found'}</p>
          <Link to={createPageUrl('Sounds')}>
            <Button variant='outline' className='mt-6'>
              <ArrowLeft className='w-5 h-5 mr-2' />
              Back to Sounds
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6'>
      <Helmet>
        {sound && (() => {
          const soundMetadata = {
            id: sound.id,
            name: sound.name,
            length: sound.length || 3,
            viralityIndex: sound.virality_index,
            hashtags: sound.hastags || [],
            year: new Date().getFullYear().toString(),
          };

          const metaTags = generateMetaTags(soundMetadata, currentLanguage);

          return (
            <>
              <title>{metaTags.title}</title>
              <meta name='description' content={metaTags.description} />
              <meta name='keywords' content={metaTags.keywords} />
              <meta property='og:title' content={metaTags.ogTitle} />
              <meta property='og:description' content={metaTags.ogDescription} />
              <meta property='og:image' content={sound.image_url} />
              <meta property='og:locale' content={metaTags.locale} />
              <meta name='twitter:card' content='summary_large_image' />
              <meta name='twitter:title' content={metaTags.twitterTitle} />
              <meta name='twitter:description' content={metaTags.twitterDescription} />
              <meta name='twitter:image' content={sound.image_url} />
              
              {sound.hastags?.map((tag) => (
                <meta key={tag} property='article:tag' content={tag} />
              ))}
              
              <link
                rel='canonical'
                href={`https://brainrot-memes.com/${currentLanguage.toLowerCase()}/memesound/${sound.id}`}
              />
              
              {generateHreflangTags(soundMetadata).map(({ hreflang, href }) => (
                <link
                  key={hreflang}
                  rel='alternate'
                  hreflang={hreflang}
                  href={href}
                />
              ))}
              
              <link
                rel='alternate'
                hreflang='x-default'
                href={`https://brainrot-memes.com/english/memesound/${sound.id}`}
              />
              
              <script type='application/ld+json'>
                {JSON.stringify(
                  generateSoundStructuredData(soundMetadata, currentLanguage)
                )}
              </script>
            </>
          );
        })()}
      </Helmet>
      
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          playbackStateRef.current = false;
          stopTimer();
        }}
        preload='auto'
      />

      {showGuestDialog && (
        <GuestDialog
          open={showGuestDialog}
          isAnonymousGuest={isAnonymousGuest}
          username={guestUsername}
          onOpenChange={setShowGuestDialog}
          onUsernameChange={(e) => setGuestUsername(e.target.value)}
          onSubmit={handleGuestSignIn}
          interactionSource={interactionSource}
          onGoogleSignIn={handleGoogleSignIn}
        />
      )}

      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <Link to={createPageUrl('Sounds')}>
            <Button
              variant='ghost'
              size='sm'
              className='flex items-center gap-2'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to sounds
            </Button>
          </Link>
        </div>

        <Card className='overflow-hidden bg-white/70 backdrop-blur-sm'>
          <div className='relative'>
            <img
              src={sound.image_url}
              alt={sound.name}
              className='w-full h-[400px] object-fill'
            />

            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

            <div className='absolute bottom-0 left-0 w-full p-6 text-white'>
              <div className='flex justify-between items-center'>
                <h1 className='text-4xl font-bold mb-2'>{sound.name}</h1>
                <Button
                  variant='outline'
                  className='text-white/80 border-white/30 hover:bg-white/10'
                  onClick={handleShowLeaderboard}
                >
                  <Trophy className='w-5 h-5 mr-2 text-yellow-400' />
                  Leaderboard
                </Button>
              </div>
              <div className='flex items-center gap-4 text-lg'>
                <div className='flex items-center gap-2'>
                  <Clock className='w-5 h-5' />
                  Current Session: {formattedTime}
                </div>
              </div>
            </div>
          </div>

          <div className='p-6 space-y-6'>
            <div className='flex flex-wrap gap-4'>
              <Button
                onClick={togglePlay}
                className='bg-purple-600 hover:bg-purple-700 h-12 px-6'
                data-play-button
              >
                {isPlaying ? (
                  <PauseCircle className='w-6 h-6 mr-2' />
                ) : (
                  <PlayCircle className='w-6 h-6 mr-2' />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>

              <div className='relative inline-block'>
                <Button
                  onClick={handleApplyStats}
                  className={`h-12 ${
                    statsUpdated
                      ? 'bg-green-600 hover:bg-green-700'
                      : canApplyStats
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-400'
                  }`}
                  disabled={!canApplyStats}
                >
                  {updatingStats ? (
                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                  ) : (
                    <Trophy className='w-5 h-5 mr-2' />
                  )}
                  {statsUpdated
                    ? 'Stats Applied!'
                    : updatingStats
                    ? 'Applying...'
                    : 'Apply to Stats'}
                </Button>

                {!canApplyStats && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`absolute inset-0 cursor-help ${
                            statsUpdated ? 'pointer-events-none' : ''
                          }`}
                          aria-label='Stats info'
                          style={{
                            pointerEvents: statsUpdated ? 'none' : 'auto',
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side='bottom' sideOffset={5}>
                        {!isEligibleUser ? (
                          <p>Only Google sign-in users can apply to stats</p>
                        ) : elapsedTime < 120 ? (
                          <p>
                            Listen for at least 2 minutes to apply to your stats
                          </p>
                        ) : (
                          <p>Apply your listening time to your stats</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <Button
                onClick={toggleLoop}
                variant={isLooping ? 'default' : 'outline'}
                className={`h-12 ${
                  isLooping ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
              >
                <RotateCw className='w-5 h-5 mr-2' />
                {isLooping ? 'Looping On' : 'Loop'}
              </Button>

              <Button onClick={toggleMute} variant='outline' className='h-12'>
                {isMuted ? (
                  <VolumeX className='w-5 h-5 mr-2' />
                ) : (
                  <Volume2 className='w-5 h-5 mr-2' />
                )}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>

              <Button
                onClick={handleDownload}
                variant='outline'
                className='h-12'
              >
                <Download className='w-5 h-5 mr-2' />
                Download
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleToggleSave}
                      variant='outline'
                      className={`h-12 ${
                        isSaved
                          ? 'text-yellow-500 bg-yellow-50 border-yellow-200'
                          : ''
                      }`}
                      disabled={loading}
                    >
                      <Star
                        className={`w-5 h-5 mr-2 ${
                          isSaved ? 'fill-yellow-500' : ''
                        }`}
                      />
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isSaved ? 'Remove from saved' : 'Add to saved sounds'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Playback Speed: {playbackRate}x
                </label>
                <div className='flex items-center gap-4'>
                  <FastForward className='w-4 h-4 text-gray-500' />
                  <input
                    type='range'
                    min='0.5'
                    max='3'
                    step='0.1'
                    value={playbackRate}
                    onChange={handlePlaybackRateChange}
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Volume
                </label>
                <div className='flex items-center gap-4'>
                  <Volume2 className='w-4 h-4 text-gray-500' />
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.1'
                    value={volume}
                    onChange={handleVolumeChange}
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                  />
                </div>
              </div>

              <AdvancedSettings
                showAdvanced={showAdvanced}
                setShowAdvanced={setShowAdvanced}
                echoCount={echoCount}
                setEchoCount={setEchoCount}
                isConfigLocked={isConfigLocked}
                setIsConfigLocked={setIsConfigLocked}
                isPlaying={isPlaying}
                onVoiceChange={handleVoiceChange}
                onVoiceProcessingStart={prepareVoiceProcessing}
                processing={processing}
                audioUrl={sound?.audio_url}
              />

              {voiceChangedAudioUrl && (
                <div className='bg-green-50 p-3 rounded-md text-green-700 text-sm flex items-center'>
                  <Sparkles className='w-4 h-4 mr-2' />
                  Voice changed audio ready! Press Play to hear it.
                </div>
              )}
              
              {error && (
                <div className='bg-red-50 p-3 rounded-md text-red-700 text-sm flex items-center'>
                  <AlertCircle className='w-4 h-4 mr-2' />
                  {error}
                </div>
              )}
            </div>

            <div className='bg-gray-50 rounded-lg p-4 mt-4'>
              <h3 className='text-lg font-medium mb-2'>About this sound</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-600'>Virality Index:</p>
                  <p className='font-medium'>
                    {sound.virality_index || 'Not available'}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Length:</p>
                  <p className='font-medium'>
                    {sound.length || 'Unknown'} seconds
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Language:</p>
                  <p className='font-medium'>
                    {sound.languages?.[0] || sound.language || 'Unknown'}
                  </p>
                </div>
              </div>

              {sound.hastags && sound.hastags.length > 0 && (
                <div className='mt-3'>
                  <p className='text-sm text-gray-600 mb-1'>Hashtags:</p>
                  <div className='flex flex-wrap gap-2'>
                    {sound.hastags.map((tag, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm'
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <SocialSection
              sound={sound}
              isAnonymousGuest={isAnonymousGuest}
              onInteraction={handleSocialInteraction}
            />
            <div className='mt-4 bg-purple-50 p-3 rounded-lg'>
              <p className='text-purple-700 font-medium text-center'>
                {getEngagementPrompts(currentLanguage.toLowerCase())[0]}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        stats={leaderboardStats}
        soundName={sound?.name}
      />
    </div>
  );
}
