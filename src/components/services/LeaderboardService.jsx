// API URLs
const LEADERBOARD_URL = 'https://getleaderboard-stbfcg576q-uc.a.run.app';
const UPDATE_STATS_URL = 'https://updateuserstats-stbfcg576q-uc.a.run.app';

// Named exports for direct imports
export const fetchLeaderboard = async (sortBy = 'total_listen_time', period = 'all_time', limit = 10) => {
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
    
    if (!data.result?.success) {
      throw new Error(data.result?.message || 'Failed to fetch leaderboard');
    }
    
    return data.result.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

/**
 * Update user activity statistics and track achievements
 * @param {number} listenTime - Time listened in seconds
 * @param {number} soundsPlayed - Number of sounds played (default: 1)
 * @param {string|null} soundId - Unique ID of the sound played (for collection achievements)
 * @param {Object} options - Additional tracking options for achievements
 * @param {string} [options.effectUsed] - Audio effect being used (for feature-based achievements)
 * @param {number} [options.sessionDuration] - Duration of current session in seconds
 * @param {boolean} [options.isNightTime] - Whether this activity is happening at night
 * @returns {Promise<Object>} The result of the API call
 */
export const updateUserStats = async (
  listenTime, 
  soundsPlayed = 1, 
  soundId = null, 
  options = {}
) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('Authentication required');
  
  // Default night time detection if not explicitly provided 
  if (options.isNightTime === undefined) {
    const currentHour = new Date().getHours();
    options.isNightTime = (currentHour >= 22 || currentHour <= 5);
  }
  
  try {
    const response = await fetch(UPDATE_STATS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        listenTime,
        soundsPlayed,
        soundId,
        // Add new achievement parameters
        effectUsed: options.effectUsed,
        sessionDuration: options.sessionDuration,
        isNightTime: options.isNightTime
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.result?.success) {
      throw new Error(data.result?.message || 'Failed to update stats');
    }
    
    return data.result.data;
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

// Create a default export that includes both functions
const LeaderboardService = {
  fetchLeaderboard,
  updateUserStats
};

export default LeaderboardService;