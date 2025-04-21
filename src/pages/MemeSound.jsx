
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ChevronDown, 
  ChevronUp, 
  Repeat,
  Star,
  Sparkles
} from "lucide-react";
import LeaderboardModal from "../components/sounds/LeaderboardModal";
import SocialSection from "../components/sounds/SocialSection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AdvancedSettings from "../components/sounds/AdvancedSettings";

// Firebase config reference
const firebaseConfig = {
  apiKey: 'AIzaSyDd5pPm43-tcWYQiWnVQPCppnByOZw4Ufo'
};

export default function MemeSoundPage() {
  // Get the name parameter from the URL
  const params = useParams();
  const location = useLocation();
  
  // The parameter might be a name or an ID
  const { name } = params;
  
  const decodedName = name ? decodeURIComponent(name) : "";
  
  // Get additional data from state if available (from SoundCard.jsx)
  const soundName = location.state?.soundName;
  const soundId = location.state?.soundId || decodedName;
  
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [statsUpdated, setStatsUpdated] = useState(false);
  const [updatingStats, setUpdatingStats] = useState(false);
  
  // Leaderboard state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardStats, setLeaderboardStats] = useState([]);

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [echoCount, setEchoCount] = useState(0);
  const [isConfigLocked, setIsConfigLocked] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  // Add state for voice changing functionality
  const [voiceChangedAudioUrl, setVoiceChangedAudioUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Audio refs
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const statsUpdateSent = useRef(false);
  const audioContextRef = useRef(null);
  const audioSourcesRef = useRef([]);
  const audioBufferRef = useRef(null);
  const gainNodeRef = useRef(null);

    useEffect(() => {
    // Clean up session ID on unmount
    return () => {
      localStorage.removeItem('current_session_id');
    };
  }, []);

  useEffect(() => {
  // Refresh token every 50 minutes (tokens expire at 60 minutes)
  const tokenRefreshInterval = setInterval(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      console.log('Proactively refreshing token before expiration');
      await refreshAccessToken(refreshToken);
    }
  }, 50 * 60 * 1000);
  
  return () => clearInterval(tokenRefreshInterval);
}, []);

  useEffect(() => {
    if (audioRef.current && sound?.audio_url) {
      audioRef.current.src = sound.audio_url;
      audioRef.current.load();
      
      // Preload audio for Web Audio API if we have a sound
      preloadAudioBuffer(sound.audio_url);
    }
    
    // Cleanup Web Audio API resources when component unmounts
    return () => {
      stopAllAudioSources();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [sound?.audio_url]);

  // Preload audio buffer for Web Audio API
  const preloadAudioBuffer = async (url) => {
    try {
      // Create Audio Context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      audioBufferRef.current = audioBuffer;
      console.log('Audio buffer loaded successfully');
    } catch (err) {
      console.error('Error preloading audio buffer:', err);
    }
  };

  useEffect(() => {
    fetchSoundDetails();
    
    // Mock leaderboard data
    setLeaderboardStats([
      {
        user_email: "meme.master@example.com",
        listen_time: 7200,
        crazy_mode_count: 42
      },
      {
        user_email: "sound.lover@example.com",
        listen_time: 3600,
        crazy_mode_count: 25
      },
      {
        user_email: "viral.king@example.com",
        listen_time: 1800,
        crazy_mode_count: 15
      }
    ]);
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Only update stats if we played for some time and haven't already sent stats
      if (elapsedTime > 0 && !statsUpdateSent.current) {
        handleStatsUpdate(elapsedTime);
        statsUpdateSent.current = true;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
    
    // Update playback rate of all active Web Audio sources
    audioSourcesRef.current.forEach(source => {
      if (source && source.playbackRate) {
        source.playbackRate.value = playbackRate;
      }
    });
  }, [playbackRate]);

  // Update volume for Web Audio API when volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Function to refresh token if needed
  const refreshAccessToken = async (refreshToken) => {
    try {
      console.log("Refreshing access token...");
      
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status}`);
      }

      const data = await response.json();

      if (!data.id_token) {
        throw new Error('Token refresh response missing id_token');
      }

      // Update tokens in localStorage
      localStorage.setItem('access_token', data.id_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      
      console.log("Token refresh successful");
      return data.id_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

const fetchSoundDetails = async (retryCount = 0) => {
  // Parameter validation
  if (!decodedName && !soundName && !soundId) {
    setError("Sound information is required");
    setLoading(false);
    return;
  }
  
  // Prevent too many retries
  if (retryCount > 2) {
    setError("Failed after multiple attempts. Please try again later.");
    setLoading(false);
    return;
  }
  
  // Offline detection
  if (!navigator.onLine) {
    setError("You appear to be offline. Please check your connection.");
    setLoading(false);
    return;
  }
  
  setLoading(true);
  
  try {
    console.log(`Fetching sound details for ID: ${soundId}, Name: ${soundName || 'Unknown'}`);
    
    // Get token from localStorage
    let accessToken = localStorage.getItem('access_token');
    
    // If no token is available, try to refresh using the refresh token
    if (!accessToken) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        accessToken = await refreshAccessToken(refreshToken);
      }
      
      if (!accessToken) {
        console.warn("No access token available. Request may fail with 401.");
      }
    }
    
    // SEARCH STRATEGY:
    
    // 1. Search using sound name if available (preferred), otherwise use the URL parameter
    const searchTerm = soundName || decodedName;
    
    const primarySearchResponse = await fetch(
      'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net/getAllSoundsMetadata',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          language: "English", 
          limit: 10,
          page: 1,
          search: searchTerm // Use name as search parameter instead of id
        }),
      }
    );
    
    // Handle 401 Unauthorized
    if (primarySearchResponse.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const newToken = await refreshAccessToken(refreshToken);
        if (newToken) {
          return fetchSoundDetails(retryCount + 1);
        }
      }
      throw new Error('Authentication required. Please log in.');
    }
    
    if (primarySearchResponse.ok) {
      const searchData = await primarySearchResponse.json();
      if (searchData.result?.success && searchData.result.data?.length > 0) {
        // If we have the soundId, try to find an exact match
        if (soundId) {
          const exactMatch = searchData.result.data.find(s => s.id === soundId);
          if (exactMatch) {
            setSound(exactMatch);
            setLoading(false);
            setIsSaved(exactMatch.isSaved || false);
            return;
          }
        }
        
        // Otherwise use the first result
        setSound(searchData.result.data[0]);
        setLoading(false);
        setIsSaved(searchData.result.data[0].isSaved || false);
        return;
      }
    }
    
    // 2. If first search failed and we're using a different search term than decodedName,
    // try with decodedName as a fallback
    if (searchTerm !== decodedName) {
      const fallbackSearchResponse = await fetch(
        'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net/getAllSoundsMetadata',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
          },
          body: JSON.stringify({
            language: "English", 
            limit: 10,
            page: 1,
            search: decodedName
          }),
        }
      );
      
      // Also check for 401 here
      if (fallbackSearchResponse.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const newToken = await refreshAccessToken(refreshToken);
          if (newToken) {
            return fetchSoundDetails(retryCount + 1);
          }
        }
        throw new Error('Authentication required. Please log in.');
      }
      
      if (fallbackSearchResponse.ok) {
        const fallbackData = await fallbackSearchResponse.json();
        if (fallbackData.result?.success && fallbackData.result.data?.length > 0) {
          // Try to find the exact match by ID first
          if (soundId) {
            const exactMatch = fallbackData.result.data.find(s => s.id === soundId);
            if (exactMatch) {
              setSound(exactMatch);
              setLoading(false);
              setIsSaved(exactMatch.isSaved || false);
              return;
            }
          }
          
          setSound(fallbackData.result.data[0]);
          setLoading(false);
          setIsSaved(fallbackData.result.data[0].isSaved || false);
          return;
        }
      }
    }
    
    // 3. Last resort: get all sounds and filter
    const response = await fetch(
      'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net/getAllSoundsMetadata',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          language: "English", 
          limit: 100,
          page: 1,
          search: "" // Empty search to get all sounds
        }),
      }
    );
    
    // Check for 401 one more time
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const newToken = await refreshAccessToken(refreshToken);
        if (newToken) {
          return fetchSoundDetails(retryCount + 1);
        }
      }
      throw new Error('Authentication required. Please log in.');
    }

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    if (!data.result?.success) throw new Error('Invalid response format');
    
    // First try to find by ID
    let foundSound = data.result.data?.find(sound => sound.id === soundId);
    
    // If not found by ID, try by name
    if (!foundSound && soundName) {
      foundSound = data.result.data?.find(sound => 
        sound.name.toLowerCase() === soundName.toLowerCase()
      );
    }
    
    // Try partial name match
    if (!foundSound) {
      foundSound = data.result.data?.find(sound => 
        sound.name.toLowerCase().includes(decodedName.toLowerCase()) ||
        (soundName && sound.name.toLowerCase().includes(soundName.toLowerCase()))
      );
    }
    
    if (foundSound) {
      setSound(foundSound);
      setIsSaved(foundSound.isSaved || false);
    } else {
      throw new Error(`Sound "${searchTerm}" not found`);
    }
  } catch (err) {
    console.error("Error fetching sound:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleToggleSave = async () => {
  try {
    setLoading(true);
    setIsSaved(!isSaved);
    
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.error('Authentication required');
        return;
    }

    const baseUrl = 'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net';
      const endpoint = isSaved ? '/removeSoundFromUserLibrary' : '/addSoundToUserLibrary';

      const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              soundId: sound.id,
          }),
      });

      if (!response.ok) {
          throw new Error(`Failed to ${isSaved ? 'unsave' : 'save'} sound`);
      }

      const data = await response.json();
      if (!data.result?.success) {
        throw new Error(data.result?.error || `Failed to ${isSaved ? 'unsave' : 'save'} sound`);
      }
  } catch (error) {
    console.error('Error toggling save state:', error);
    setIsSaved(isSaved);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

const handleStatsUpdate = async (listenTime) => {
  if (listenTime < 2 || !sound?.id || statsUpdateSent.current) return;
  
  try {
    console.log('Updating stats:', { listenTime, soundId: sound.id });
    setUpdatingStats(true);
    
    // Track that we're sending stats to prevent duplicate sends
    statsUpdateSent.current = true;
    
    // Add a unique session ID to help prevent duplicate submissions
    const sessionId = localStorage.getItem('current_session_id') || 
                      `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Store the session ID for this tab
    if (!localStorage.getItem('current_session_id')) {
      localStorage.setItem('current_session_id', sessionId);
    }
    
    // Calculate actual play time more accurately (to prevent client-side tampering)
    const actualPlayTime = Math.min(listenTime, elapsedTime); // Can't be more than elapsed time
    
    // Implement reasonable maximum values
    const reasonableListenTime = Math.min(actualPlayTime, 7200); // Cap at 2 hours
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Authentication required');
      return;
    }
    
    // Include session ID and timestamp in request
    const response = await fetch('https://updateuserstats-stbfcg576q-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        listenTime: reasonableListenTime,
        soundsPlayed: 1,
        soundId: sound.id,
        language: sound.language || "English",
        effectUsed: echoCount > 0 ? `echo_${echoCount}` : null,
        sessionDuration: reasonableListenTime,
        sessionId: sessionId, // Include session ID to prevent duplicates
        clientTimestamp: new Date().toISOString() // Include timestamp
      })
    });
    
    // Clear session ID when component unmounts or on successful update
    localStorage.removeItem('current_session_id');
    
    if (!response.ok) {
      if (response.status === 429) {
        console.log('Rate limited or duplicate submission detected');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Stats update response:', data);
    setStatsUpdated(true);
    
  } catch (err) {
    console.error('Error updating stats:', err);
  } finally {
    setUpdatingStats(false);
  }
};

  // Stop all audio sources
  const stopAllAudioSources = () => {
    audioSourcesRef.current.forEach(source => {
      if (source && typeof source.stop === 'function') {
        try {
          source.stop();
        } catch (e) {
          // Ignore errors if the source is already stopped
        }
      }
    });
    audioSourcesRef.current = [];
  };

  // Play with Web Audio API and echo effect
  const playWithEcho = async () => {
    if (!sound?.audio_url || !audioBufferRef.current) {
      console.error("Audio not available or not loaded");
      return;
    }

    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Create a master gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
      gainNodeRef.current.connect(audioContextRef.current.destination);

      // Clear any existing sources
      stopAllAudioSources();

      // Determine actual number of instances to play
      // echoCount is 0-5 from UI slider, but we'll scale it to get up to 20 instances
      let instanceCount = echoCount === 0 ? 1 : (echoCount * 4); // 0, 4, 8, 12, 16, 20
      instanceCount = Math.min(instanceCount, 20); // Cap at 20

      console.log(`Playing sound with ${instanceCount} echo instances`);

      // Play the instances
      for (let i = 0; i < instanceCount; i++) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        
        // Set playback rate to match current setting
        source.playbackRate.value = playbackRate;
        
        // Create stereo panner for position
        const panner = audioContextRef.current.createStereoPanner();
        
        // Calculate pan and detune values
        // First instance is centered with no detune
        let pan = 0;
        let detune = 0;
        
        if (i > 0) {
          // For echo instances, create varying pan and detune values
          pan = Math.sin((i / instanceCount) * Math.PI * 2) * 0.8; // Distribute across stereo field
          detune = ((i / instanceCount) * 100) - 50; // Detune between -50 and +50 cents
        }
        
        panner.pan.value = pan;
        source.detune.value = detune;
        
        // Connect source to panner to gain node to destination
        source.connect(panner);
        panner.connect(gainNodeRef.current);
        
        // Set loop if needed
        source.loop = isLooping;
        
        // Start playback
        source.start(0);
        
        // Save reference to the source
        audioSourcesRef.current.push(source);
        
        // Add onended handler for the main source only
        if (i === 0) {
          source.onended = () => {
            if (!isLooping) {
              setIsPlaying(false);
              stopAllAudioSources();
            }
          };
        }
      }
    } catch (err) {
      console.error("Error playing audio with Web Audio API:", err);
      setError("Could not play audio with echo effect: " + err.message);
      
      // Fallback to regular audio playback
      if (audioRef.current) {
        audioRef.current.play().catch(e => {
          console.error("Fallback audio playback failed:", e);
        });
      }
    }
  };

  // Toggle play/pause with stats tracking and echo effect
  const togglePlay = async () => {
    if (isPlaying) {
      // Stop all audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopAllAudioSources();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsPlaying(false);
    } else {
      // Start playback with or without echo
      await handlePlay();
      
      // Start timer for stats tracking
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      setIsPlaying(true);
    }
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
    
    // Also update Web Audio API gain node
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newMuteState ? 0 : volume;
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
      if (value === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
    
    // Also update Web Audio API gain node
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = value;
    }
  };

  const toggleLoop = () => {
    const newLoopState = !isLooping;
    setIsLooping(newLoopState);
    
    if (audioRef.current) {
      audioRef.current.loop = newLoopState;
    }
    
    // Update loop state for Web Audio sources
    audioSourcesRef.current.forEach(source => {
      if (source) {
        source.loop = newLoopState;
      }
    });
  };

  const handleDownload = () => {
    if (!sound?.audio_url) {
      console.error("No audio URL available for download");
      return;
    }
    
    // Fetch the audio file and download it
    fetch(sound.audio_url)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sound.name || 'meme-sound'}.mp3`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error downloading audio:', error);
      });
  };

  const handleApplyStats = async () => {
    if (elapsedTime >= 120) {
      await handleStatsUpdate(elapsedTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset stats on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Only update stats if we played for some time and haven't already sent stats
      if (elapsedTime >= 120 && !statsUpdateSent.current) {
        handleStatsUpdate(elapsedTime);
      }
    };
  }, [elapsedTime]);

  // If echo count changes and we're playing, restart to apply the new echo settings
  useEffect(() => {
    if (isPlaying && !isConfigLocked) {
      // Restart playback with new settings
      const restartPlayback = async () => {
        stopAllAudioSources();
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        // Small delay to ensure everything stops properly
        await new Promise(resolve => setTimeout(resolve, 50));
        
        if (echoCount > 0) {
          await playWithEcho();
        } else if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(err => console.error("Error restarting audio:", err));
        }
      };
      
      restartPlayback();
    }
  }, [echoCount]);

  // Add handler for voice change
  const handleVoiceChange = (newAudioUrl) => {
    setVoiceChangedAudioUrl(newAudioUrl);
    setProcessing(false);
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
          audioRef.current.src = audioUrl; // Set the audio source
          await audioRef.current.play();
        } catch (err) {
          console.error("Error playing audio:", err);
          setError("Could not play audio: " + err.message);
          return;
        }
      }
    }
  };

  // Add this to prepare for voice processing
  const prepareVoiceProcessing = () => {
    setProcessing(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !sound) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error || 'Sound not found'}</p>
          <Link to={createPageUrl("Sounds")}>
            <Button variant="outline" className="mt-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Sounds
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to={createPageUrl("Sounds")}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to sounds
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden bg-white/70 backdrop-blur-sm">
          <div className="relative">
            <img 
              src={sound.image_url}
              alt={sound.name}
              className="w-full h-[400px] object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-2">{sound.name}</h1>
                <Button 
                  variant="outline" 
                  className="text-white/80 border-white/30 hover:bg-white/10"
                  onClick={() => setShowLeaderboard(true)}
                >
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Leaderboard
                </Button>
              </div>
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Current Session: {formatTime(elapsedTime)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={togglePlay}
                  className="bg-purple-600 hover:bg-purple-700 h-12 px-6"
                >
                  {isPlaying ? (
                    <PauseCircle className="w-6 h-6 mr-2" />
                  ) : (
                    <PlayCircle className="w-6 h-6 mr-2" />
                  )}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>

                {/* Complete solution for fully visible tooltip with disabled button */}
                <div className="relative inline-block">
                  <Button 
                    onClick={handleApplyStats}
                    className={`h-12 ${
                      statsUpdated 
                        ? "bg-green-600 hover:bg-green-700" 
                        : elapsedTime >= 120 
                          ? "bg-purple-600 hover:bg-purple-700" 
                          : "bg-gray-400"
                    }`}
                    disabled={elapsedTime < 120 || statsUpdated || updatingStats}
                  >
                    {updatingStats ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Trophy className="w-5 h-5 mr-2" />
                    )}
                    {statsUpdated 
                      ? "Stats Applied!" 
                      : updatingStats 
                        ? "Applying..." 
                        : "Apply to Stats"
                    }
                  </Button>
                  
                  {/* Overlay div that serves as tooltip trigger - covers the entire button area */}
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="absolute inset-0 cursor-help" 
                        aria-label="Stats info" 
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Listen for at least 2 minutes to apply to your stats</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                </div>

                <Button
                  onClick={toggleLoop}
                  variant={isLooping ? "default" : "outline"}
                  className={`h-12 ${isLooping ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <RotateCw className="w-5 h-5 mr-2" />
                  {isLooping ? "Looping On" : "Loop"}
                </Button>

                <Button
                  onClick={toggleMute}
                  variant="outline"
                  className="h-12"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 mr-2" />
                  ) : (
                    <Volume2 className="w-5 h-5 mr-2" />
                  )}
                  {isMuted ? "Unmute" : "Mute"}
                </Button>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="h-12"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleToggleSave}
                        variant="outline"
                        className={`h-12 ${isSaved ? "text-yellow-500 bg-yellow-50 border-yellow-200" : ""}`}
                        disabled={loading}
                      >
                        <Star className={`w-5 h-5 mr-2 ${isSaved ? "fill-yellow-500" : ""}`} />
                        {isSaved ? "Saved" : "Save"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isSaved ? "Remove from saved" : "Add to saved sounds"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Playback Speed: {playbackRate}x
                </label>
                <div className="flex items-center gap-4">
                  <FastForward className="w-4 h-4 text-gray-500" />
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={playbackRate}
                    onChange={handlePlaybackRateChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume
                </label>
                <div className="flex items-center gap-4">
                  <Volume2 className="w-4 h-4 text-gray-500" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Advanced options here, below volume control */}
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
                audioUrl={sound?.audio_url}  // Pass the current sound's audio URL
              />
              
              {/* Show information about voice changed audio */}
              {voiceChangedAudioUrl && (
                <div className="bg-green-50 p-3 rounded-md text-green-700 text-sm flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Voice changed audio ready! Press Play to hear it.
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="text-lg font-medium mb-2">About this sound</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Virality Index:</p>
                  <p className="font-medium">{sound.virality_index || "Not available"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Length:</p>
                  <p className="font-medium">{sound.length || "Unknown"} seconds</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Language:</p>
                  <p className="font-medium">{sound.languages?.[0] || sound.language || "Unknown"}</p>
                </div>
              </div>
              
              {sound.hastags && sound.hastags.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Hashtags:</p>
                  <div className="flex flex-wrap gap-2">
                    {sound.hastags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <SocialSection sound={sound} />
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
