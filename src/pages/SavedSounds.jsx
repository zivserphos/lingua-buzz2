import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Loader2, Star, Search as SearchIcon } from "lucide-react";
import SoundCard from "../components/sounds/SoundCard";
import SocialService from "@/components/services/SocialService";
import { Input } from "@/components/ui/input";

export default function SavedSoundsPage() {
  const [savedSounds, setSavedSounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSounds, setFilteredSounds] = useState([]);

  useEffect(() => {
    fetchSavedSounds();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = savedSounds.filter(sound => 
        sound.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSounds(filtered);
    } else {
      setFilteredSounds(savedSounds);
    }
  }, [searchTerm, savedSounds]);

  const fetchSavedSounds = async (isReset = false) => {
    try {
      setLoading(true);
      const page = isReset ? 1 : currentPage;
      const response = await SocialService.getSavedSounds(20, page);
      
      if (response.result?.success) {
        const newSounds = response.result.data || [];
        const pagination = response.result.pagination;
        
        if (isReset) {
          setSavedSounds(newSounds);
        } else {
          setSavedSounds(prev => [...prev, ...newSounds]);
        }
        
        setHasMorePages(pagination.hasNextPage);
      } else {
        throw new Error(response.result?.message || "Failed to load saved sounds");
      }
    } catch (error) {
      console.error("Error fetching saved sounds:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMorePages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const soundsToDisplay = filteredSounds;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to={createPageUrl("Sounds")}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to sounds
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-8 h-8 text-yellow-500" />
              Your Saved Sounds
            </h1>
            <p className="text-gray-600 mt-2">
              Access your favorite meme sounds easily
            </p>
          </div>
          
          <Button
            onClick={() => {
              setCurrentPage(1);
              fetchSavedSounds(true);
            }}
            disabled={loading}
            variant="outline"
            className="bg-white/50 backdrop-blur-sm"
          >
            {loading && currentPage === 1 ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Refresh
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search your saved sounds..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-10 h-12 bg-white/50 backdrop-blur-sm border-none text-lg w-full"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && savedSounds.length === 0 ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : savedSounds.length === 0 ? (
          <div className="text-center py-20 bg-white/30 backdrop-blur-sm rounded-lg shadow-sm">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No saved sounds yet</h3>
            <p className="text-gray-500 mb-6">
              Save your favorite meme sounds to access them quickly
            </p>
            <Link to={createPageUrl("Sounds")}>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Browse Sounds
              </Button>
            </Link>
          </div>
        ) : soundsToDisplay.length === 0 && searchTerm ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No matches found for "{searchTerm}" 😢</p>
            <Button 
              variant="link" 
              onClick={clearSearch}
              className="mt-2"
            >
              Clear search
            </Button>
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {soundsToDisplay.map(sound => (
                <SoundCard 
                  key={sound.id} 
                  sound={{
                    ...sound,
                    isSaved: true, // These sounds are already saved
                    hashtags: sound.hastags, // Fix property name
                  }}
                />
              ))}
            </motion.div>
            
            {hasMorePages && !searchTerm && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={loadMore} 
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : null}
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}