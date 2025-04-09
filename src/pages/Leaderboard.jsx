import React, { useState, useEffect } from "react";
import { Crown, Clock, Trophy, ArrowLeft, Flame, UserCircle, Music, Medal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Clock, 
  Loader2, 
  Trophy,
  Award
} from "lucide-react";
// other imports...
// REMOVE THIS LINE: import { fetchLeaderboard } from "@/components/services/LeaderboardService";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("all_time");
  const [sortBy, setSortBy] = useState("total_listen_time");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);

  // ADD THIS FUNCTION DIRECTLY IN THE COMPONENT
  // This bypasses any module loading issues
  const fetchLeaderboardDirectly = async (sortBy = 'total_listen_time', period = 'all_time', limit = 10) => {
    const LEADERBOARD_URL = 'https://getleaderboard-stbfcg576q-uc.a.run.app';
    const token = localStorage.getItem('access_token');
    
    if (!token) throw new Error('Authentication required');

    try {
      const url = `${LEADERBOARD_URL}?limit=${limit}&sortBy=${sortBy}&period=${period}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (!data.result?.success) {
        throw new Error(data.result?.message || 'Failed to fetch leaderboard');
      }
      
      return data.result.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  };

  // Simplified useEffect
  useEffect(() => {
    loadLeaderboard().catch(err => {
      console.error("Error in loadLeaderboard:", err);
      setError(err.message || "Failed to load leaderboard");
      setLoading(false);
    });
  }, [activeTab, sortBy]);

  // Update this function to use the inline function
  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the inline function instead of the imported one
      const data = await fetchLeaderboardDirectly(sortBy, activeTab);
      console.log('Leaderboard data received:', data);
      
      if (data && data.leaderboard && Array.isArray(data.leaderboard)) {
        setStats(data.leaderboard);
      } else if (Array.isArray(data)) {
        setStats(data);
      } else {
        setStats([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard');
      setLoading(false);
      throw err;
    }
  };

  // Rest of your component remains the same

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "0h 0m";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <Link to="/sounds">
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/sounds">
            <Button variant="ghost" size="icon" className="bg-white/50 backdrop-blur-sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Sound Masters Hall of Fame
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <Tabs defaultValue="all_time" className="w-full max-w-md" onValueChange={setActiveTab}>
            <TabsList className="bg-white/50 backdrop-blur-sm border p-1 w-full">
              <TabsTrigger value="all_time" className="flex-1">All Time Legends</TabsTrigger>
              <TabsTrigger value="weekly" className="flex-1">Weekly Warriors</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={sortBy} onValueChange={setSortBy} className="w-full max-w-xs">
            <SelectTrigger className="bg-white/50 backdrop-blur-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total_listen_time">Listen Time</SelectItem>
              <SelectItem value="sounds_played">Sounds Played</SelectItem>
              <SelectItem value="streak">Streak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence mode="wait">
          {stats.map((leader, index) => (
            <motion.div
              key={leader.user_email || leader.display_name || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <Card className={`
                relative overflow-hidden
                ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' :
                  index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
                  index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' :
                  'bg-white'}
              `}>
                <motion.div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{
                    background: "linear-gradient(90deg, #9333EA 0%, #EC4899 100%)",
                    scaleX: index === 0 ? 1 : index === 1 ? 0.7 : index === 2 ? 0.5 : 0.3
                  }}
                />
                
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`
                      relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold
                      ${index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-700'}
                    `}>
                      {leader.rank || index + 1}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          border: '2px solid',
                          borderColor: index === 0 ? '#EAB308' : 
                                    index === 1 ? '#9CA3AF' : 
                                    '#F97316',
                          opacity: 0.5
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">
                          {leader.display_name || leader.user_email?.split('@')[0] || `User ${index + 1}`}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                          Level {leader.level || 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-white/50 rounded-lg p-3">
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Total Time
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {formatTime(leader.total_listen_time)}
                          </div>
                        </div>

                        <div className="bg-white/50 rounded-lg p-3">
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            Sounds Played
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {leader.total_sounds_played || leader.sounds_played || 0}
                          </div>
                        </div>

                        <div className="bg-white/50 rounded-lg p-3">
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Streak
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {leader.current_streak || 0} days
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {(leader.achievements || []).map((achievement, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-sm bg-white/50 text-gray-700"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {stats.length === 0 && !loading && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500">No leaderboard data available</h3>
              <p className="text-gray-400 mt-2">Be the first to make the hall of fame!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
