import { useState, useEffect, useRef } from 'react';
import useAuth from '@/hooks/useAuth';

/**
 * Custom hook for tracking playback time and applying stats
 * @param {Object} options Configuration options
 * @param {string} options.soundId The ID of the sound being played
 * @param {string} options.language The language of the sound
 * @param {string|null} options.effectUsed Optional effect being used (e.g. "echo_3")
 * @returns {Object} Stats applier state and methods
 */
export default function useStatsApplier({ soundId, language, effectUsed = null }) {
  const { user, isAnonymousGuest } = useAuth();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [statsUpdated, setStatsUpdated] = useState(false);
  const [updatingStats, setUpdatingStats] = useState(false);
  const [error, setError] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const timerRef = useRef(null);
  const statsUpdateSent = useRef(false);
  const sessionIdRef = useRef(
    `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Auto-submit stats if eligible when component unmounts
      if (
        elapsedTime >= 12 && 
        !statsUpdateSent.current && 
        user && 
        !isAnonymousGuest && 
        soundId
      ) {
        applyStats();
      }
    };
  }, []);

  // Start/stop timer based on isTimerActive state
  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive]);

  /**
   * Apply stats to the user's profile
   * @returns {Promise<boolean>} Success state
   */
const applyStats = async () => {
  // Only Google-authenticated users can apply stats
  if (isAnonymousGuest || !user) {
    setError("Only logged in users can apply to stats");
    return false;
  }

  // Don't proceed if minimum requirements aren't met
  if (elapsedTime < 12 || !soundId || statsUpdateSent.current) {
    return false;
  }

  try {
    setUpdatingStats(true);
    setError(null);
    
    // Add logging to check execution flow
    console.log("Starting stats application", {soundId, elapsedTime});
    
    // Mark stats as being sent to prevent duplicates
    statsUpdateSent.current = true;
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      'https://updateuserstats-stbfcg576q-uc.a.run.app',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listenTime: Math.min(elapsedTime, 7200),
          soundsPlayed: 1,
          soundId: soundId,
          language: language || 'English',
          effectUsed: effectUsed,
          sessionDuration: elapsedTime,
          sessionId: sessionIdRef.current,
          clientTimestamp: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      console.error("Stats API error:", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Stats updated successfully:", data);
    
    // Show success state
    setStatsUpdated(true);
    
    // Reset timer to 0 but keep it running if it was active
    const wasTimerActive = isTimerActive;
    setElapsedTime(0);
    statsUpdateSent.current = false;
    
    // Create a new session ID for the next stats submission
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // After a short delay, reset statsUpdated so user can apply again when eligible
    setTimeout(() => {
      setStatsUpdated(false);
    }, 3000);
    
    return true;
  } catch (err) {
    console.error("Error updating stats:", err);
    statsUpdateSent.current = false; // Reset so the user can try again
    setError(err.message);
    return false;
  } finally {
    setUpdatingStats(false);
  }
};

  /**
   * Start the timer
   */
  const startTimer = () => {
    setIsTimerActive(true);
  };

  /**
   * Stop the timer
   */
  const stopTimer = () => {
    setIsTimerActive(false);
  };

  /**
   * Format seconds into MM:SS format
   * @param {number} seconds Time in seconds
   * @returns {string} Formatted time
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Reset all state
   */
  const reset = () => {
    setElapsedTime(0);
    setStatsUpdated(false);
    setUpdatingStats(false);
    setError(null);
    setIsTimerActive(false);
    statsUpdateSent.current = false;
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  return {
    // State
    elapsedTime,
    statsUpdated,
    updatingStats,
    error,
    isTimerActive,
    
    // Derived state
    formattedTime: formatTime(elapsedTime),
    canApplyStats: elapsedTime >= 12 && !statsUpdated && !updatingStats && !isAnonymousGuest && !!user,
    isEligibleUser: !isAnonymousGuest && !!user,
    
    // Methods
    applyStats,
    startTimer,
    stopTimer,
    reset,
  };
}
