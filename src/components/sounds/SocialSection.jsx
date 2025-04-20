import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { debounce } from 'lodash';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import SocialService from '@/components/services/SocialService';

export default function SocialSection({ sound }) {
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(sound?.isLiked || false);
  const [totalLikesCount, setTotalLikesCount] = useState(sound?.num_of_likes || 0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());
  // This would be replaced with actual user ID from auth context
  const currentUserId = 'current_user'; 

  // Debounced like handlers with local state updates
  const debouncedSoundLike = useCallback(
    debounce(async (shouldLike) => {
      try {
        if (shouldLike) {
          await SocialService.like('sound', sound.id);
        } else {
          await SocialService.unlike('sound', sound.id);
        }
        // We don't need to reload likes since we're updating UI optimistically
      } catch (error) {
        console.error('Error with sound like:', error);
        // Revert UI state on error
        setIsLiked(!shouldLike);
        // Also revert the total likes count
        setTotalLikesCount(prev => shouldLike ? Math.max(prev - 1, 0) : prev + 1);
      }
    }, 300),
    [sound?.id]
  );

  const debouncedCommentLike = useCallback(
    debounce(async (commentId, shouldLike) => {
      try {
        if (shouldLike) {
          await SocialService.like('comment', commentId, sound.id);
        } else {
          await SocialService.unlike('comment', commentId, sound.id);
        }
        // State is already updated in handleCommentLike for responsive UI
      } catch (error) {
        console.error('Error with comment like:', error);
        // Revert UI state on error
        setLikedComments(prev => {
          const newSet = new Set(prev);
          shouldLike ? newSet.delete(commentId) : newSet.add(commentId);
          return newSet;
        });
        
        // Also revert the comment likes count
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  num_of_likes: shouldLike 
                    ? Math.max((comment.num_of_likes || 0) - 1, 0) 
                    : (comment.num_of_likes || 0) + 1,
                  isLiked: !shouldLike
                } 
              : comment
          )
        );
      }
    }, 300),
    [sound?.id]
  );

  const handleSoundLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Update total likes count immediately for responsive UI
    setTotalLikesCount(prev => newLikedState ? prev + 1 : Math.max(prev - 1, 0));
    
    debouncedSoundLike(newLikedState);
  };

  const handleCommentLike = (commentId) => {
    // Get the current comment's like status
    const isCurrentlyLiked = likedComments.has(commentId);
    const shouldLike = !isCurrentlyLiked;
    
    // Update UI state immediately
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (shouldLike) {
        newSet.add(commentId);
      } else {
        newSet.delete(commentId);
      }
      return newSet;
    });
    
    // Update comment like count immediately for responsive UI
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              num_of_likes: shouldLike 
                ? (comment.num_of_likes || 0) + 1 
                : Math.max((comment.num_of_likes || 0) - 1, 0),
              isLiked: shouldLike
            } 
          : comment
      )
    );
    
    // Send API request (debounced)
    debouncedCommentLike(commentId, shouldLike);
  };

  useEffect(() => {
    if (sound?.id) {
      loadComments();
      // Initialize isLiked and totalLikesCount from sound object
      setIsLiked(sound.isLiked || false);
      setTotalLikesCount(sound.num_of_likes || 0);
    }
  }, [sound?.id]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await SocialService.getComments(sound.id);
      // Update this line to correctly extract comments from the response
      const commentsData = response.result?.data?.comments || [];
      setComments(commentsData);
      
      // Setup initial liked comments state based on isLiked property
      const newLikedComments = new Set();
      commentsData.forEach(comment => {
        if (comment.isLiked) {
          newLikedComments.add(comment.id);
        }
      });
      setLikedComments(newLikedComments);
      
      console.log('Comments loaded:', commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentText = newComment;
    const tempId = `temp-${Date.now()}`;
    
    // Create a temporary comment for immediate UI feedback
    const tempComment = {
      id: tempId,
      text: commentText,
      userId: currentUserId,
      createdAt: { _seconds: Math.floor(Date.now() / 1000) },
      num_of_likes: 0,
      isLiked: false
    };

    // Optimistically add to UI
    setComments(prev => [tempComment, ...prev]);
    setNewComment('');

    try {
      // Make actual API call
      await SocialService.addComment(sound.id, commentText);
      // Refresh comments to get the real data
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      // Revert UI change on error
      setComments(prev => prev.filter(c => c.id !== tempId));
      setNewComment(commentText);
    }
  };

  // Helper to format timestamp from Firestore
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    // Convert Firestore timestamp to JS Date
    const date = new Date(timestamp._seconds * 1000);
    // Format the date nicely for display
    return date.toLocaleString();
  };
  
  // Helper to get user initials
  const getUserInitials = (userId) => {
    if (!userId) return '?';
    return userId.substring(0, 2).toUpperCase();
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isLiked ? "default" : "outline"}
                className={isLiked ? "bg-pink-600 hover:bg-pink-700" : ""}
                onClick={handleSoundLike}
                disabled={loading}
              >
                <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {totalLikesCount} Likes
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLiked ? 'Unlike' : 'Like'} this sound</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-2 text-gray-600">
          <MessageCircle className="w-5 h-5" />
          {comments.length} Comments
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 space-y-4">
        <form onSubmit={handleComment} className="flex gap-2">
          <Input
            placeholder="Add a friendly comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !newComment.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>

        <ScrollArea className="h-[300px] pr-4">
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3 mb-4"
              >
                <Avatar>
                  <AvatarImage src={comment.user_image} />
                  <AvatarFallback>
                    {getUserInitials(comment.userId)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">
                    User {comment.userId?.substring(0, 5) || 'Anonymous'}
                  </div>
                  <div className="text-gray-600">{comment.text}</div>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center gap-1 text-sm ${
                        likedComments.has(comment.id) 
                          ? 'text-pink-600' 
                          : 'text-gray-500 hover:text-pink-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${
                        likedComments.has(comment.id) ? 'fill-current' : ''
                      }`} />
                      {comment.num_of_likes || 0}
                    </button>
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No comments yet. Be the first to comment!
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </div>
  );
}