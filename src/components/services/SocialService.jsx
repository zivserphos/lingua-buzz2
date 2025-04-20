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
  
  async saveSound(soundId) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BASE_URL}savesound-stbfcg576q-uc.a.run.app`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: { soundId }
      })
    });

    if (!response.ok) throw new Error('Failed to save sound');
    return response.json();
  },

  async unsaveSound(soundId) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BASE_URL}unsavesound-stbfcg576q-uc.a.run.app`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: { soundId }
      })
    });

    if (!response.ok) throw new Error('Failed to unsave sound');
    return response.json();
  },

  async getSavedSounds(limit = 20, page = 1) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BASE_URL}getsavedsounds-stbfcg576q-uc.a.run.app`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          limit,
          page
        }
      })
    });

    if (!response.ok) throw new Error('Failed to fetch saved sounds');
    return response.json();
  },
  
  async getComments(soundId) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BASE_URL}getcomments-stbfcg576q-uc.a.run.app`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          soundId
        }
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
        data: {
          soundId,
          text
        }
      })
    });

    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
  }
};

export default SocialService;