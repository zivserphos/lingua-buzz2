
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
  Trophy
} from "lucide-react";
import LeaderboardModal from "../components/sounds/LeaderboardModal";
import SocialSection from "../components/sounds/SocialSection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [totalListenTime, setTotalListenTime] = useState(0);
  
  // Leaderboard state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardStats, setLeaderboardStats] = useState([]);
  
  const [canApplyStats, setCanApplyStats] = useState(false);
  
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && sound?.audio_url) {
      audioRef.current.src = sound.audio_url;
      audioRef.current.load();
    }
  }, [sound?.audio_url]);

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
  }, [decodedName]); // Re-fetch when name changes

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

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

  const fetchSoundDetails = async () => {
   if (!decodedName && !soundName && !soundId) {
    setError("Sound information is required");
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
            return fetchSoundDetails();
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
              return;
            }
          }
          
          // Otherwise use the first result
          setSound(searchData.result.data[0]);
          setLoading(false);
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
        
        if (fallbackSearchResponse.ok) {
          const fallbackData = await fallbackSearchResponse.json();
          if (fallbackData.result?.success && fallbackData.result.data?.length > 0) {
            // Try to find the exact match by ID first
            if (soundId) {
              const exactMatch = fallbackData.result.data.find(s => s.id === soundId);
              if (exactMatch) {
                setSound(exactMatch);
                setLoading(false);
                return;
              }
            }
            
            setSound(fallbackData.result.data[0]);
            setLoading(false);
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

const handleStatsUpdate = async (listenTime) => {
  if (listenTime > 0 && sound?.id) {
    try {
      console.log('Updating stats:', { listenTime, soundId: sound.id });
      
      // Implement the API call directly instead of using imported function
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Authentication required');
        return;
      }
      
      const response = await fetch('https://updateuserstats-stbfcg576q-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          listenTime: listenTime,
          soundsPlayed: 1,
          soundId: sound.id
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Stats update response:', data);
      
    } catch (err) {
      console.error('Error updating stats:', err);
      // Don't show error to user, just log it
    }
  }
};

  // Update togglePlay to include stats update
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        // Only update stats if we actually played for some time
        if (elapsedTime > 0) {
          handleStatsUpdate(elapsedTime);
        }
      }
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        setError("Could not play audio: " + err.message);
      });
      
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    setIsPlaying(!isPlaying);
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Only update stats if we actually played for some time
      if (elapsedTime > 0) {
        handleStatsUpdate(elapsedTime);
      }
    };
  }, []);

  // Rest of the component remains unchanged

  const handlePlaybackRateChange = (e) => {
    const value = parseFloat(e.target.value);
    setPlaybackRate(value);
    if (audioRef.current) {
      audioRef.current.playbackRate = value;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
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
  };

  const toggleLoop = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = !isLooping;
    setIsLooping(!isLooping);
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

  // Update stats tracking
  useEffect(() => {
    if (elapsedTime >= 120) {
      setCanApplyStats(true);
    }
  }, [elapsedTime]);

  const handleApplyStats = async () => {
    if (elapsedTime >= 120) {
      try {
        await handleStatsUpdate(elapsedTime);
        setElapsedTime(0);
        setCanApplyStats(false);
      } catch (err) {
        console.error('Error applying stats:', err);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

          {/* Rest of the UI remains the same */}
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

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleApplyStats}
                      className={`h-12 ${canApplyStats ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"}`}
                      disabled={!canApplyStats}
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      Apply to Stats
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Listen for at least 2 minutes to apply to your stats</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

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
                  <p className="font-medium">{sound.languages?.[0] || "Unknown"}</p>
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

          {/* ... keep rest of the component */}
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
