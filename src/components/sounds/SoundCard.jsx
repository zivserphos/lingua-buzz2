import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, Sparkles, Trophy, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LeaderboardModal from "./LeaderboardModal";
import SocialService from "@/components/services/SocialService";

export default function SoundCard({ sound }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isLiked, setIsLiked] = useState(sound?.isLiked || false);
  const [likeCount, setLikeCount] = useState(sound?.num_of_likes || 0);
  const [loading, setLoading] = useState(false);

  const soundUrl = createPageUrl("MemeSound", { name: sound.id });
  const soundState = { 
    soundName: sound.name,
    soundId: sound.id
  };

  const leaderboardStats = [
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
  ];

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setLoading(true);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

      if (isLiked) {
        await SocialService.unlike('sound', sound.id);
      } else {
        await SocialService.like('sound', sound.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <Card className="overflow-hidden bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={sound.image_url}
              alt={sound.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Link 
                to={soundUrl}
                state={soundState}
                className="inline-flex"
              >
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Go Crazy
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg leading-tight">{sound.name}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-pink-500 hover:text-pink-600 ${isLiked ? 'bg-pink-50' : ''}`}
                  onClick={handleLike}
                  disabled={loading}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="ml-1">{likeCount}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-yellow-500 hover:text-yellow-600"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowLeaderboard(true);
                  }}
                >
                  <Trophy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{sound.virality_index}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{sound.length}s</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {sound.hastags?.slice(0, 3).map((tag, i) => (
                <Badge 
                  key={i}
                  variant="secondary" 
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            <audio 
              controls 
              className="w-full mt-3" 
              preload="none"
            >
              <source src={sound.audio_url} type="audio/mpeg" />
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