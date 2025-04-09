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

export const updateUserStats = async (listenTime, soundsPlayed = 1, soundId = null) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('Authentication required');
  
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
        soundId
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