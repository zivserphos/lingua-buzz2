// Service to handle social interactions
const BASE_URL = 'https://';

const SocialService = {
  async like(contentType, id, parentId = null) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BASE_URL}like-stbfcg576q-uc.a.run.app`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          contentType,
          id,
          ...(parentId && { parentId })
        }
      })
    });

    if (!response.ok) throw new Error('Failed to like content');
    return response.json();
  },

  async unlike(contentType, id, parentId = null) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BASE_URL}unlike-stbfcg576q-uc.a.run.app`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          contentType,
          id,
          ...(parentId && { parentId })
        }
      })
    });

    if (!response.ok) throw new Error('Failed to unlike content');
    return response.json();
  },
  
  // Legacy compatibility methods
  async likeSound(soundId) {
    console.log('Using legacy likeSound method');
    return this.like('sound', soundId);
  },
  
  async unlikeSound(soundId) {
    console.log('Using legacy unlikeSound method');
    return this.unlike('sound', soundId);
  },
  
  async likeRingtone(ringtoneId) {
    console.log('Using legacy likeRingtone method');
    return this.like('ringtone', ringtoneId);
  },
  
  async unlikeRingtone(ringtoneId) {
    console.log('Using legacy unlikeRingtone method');
    return this.unlike('ringtone', ringtoneId);
  },
  
  async likeComment(commentId, soundId) {
    console.log('Using legacy likeComment method');
    return this.like('comment', commentId, soundId);
  },
  
  async unlikeComment(commentId, soundId) {
    console.log('Using legacy unlikeComment method');
    return this.unlike('comment', commentId, soundId);
  },

  async getComments(soundId, page = 1, limit = 20) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BASE_URL}getcomments-stbfcg576q-uc.a.run.app`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: { soundId, page, limit }
      })
    });

    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },

  async addComment(soundId, text) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BASE_URL}addcomment-stbfcg576q-uc.a.run.app`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: { soundId, text }
      })
    });

    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
  },

  async getLikes(soundId, limit = 20) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BASE_URL}getlikes-stbfcg576q-uc.a.run.app`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: { soundId, limit }
      })
    });

    if (!response.ok) throw new Error('Failed to fetch likes');
    return response.json();
  },
  
  // Helper method for ringtone likes if needed
  async getRingtoneLikes(ringtoneId, limit = 20) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BASE_URL}getringtonelikes-stbfcg576q-uc.a.run.app`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: { ringtoneId, limit }
      })
    });

    if (!response.ok) throw new Error('Failed to fetch ringtone likes');
    return response.json();
  }
};

export default SocialService;