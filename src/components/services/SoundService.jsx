// Sound service for fetching data from the Firebase API

export async function fetchSounds({ language = 'English', search = '', page = 1, limit = 20, idToken }) {
  if (!idToken) {
    throw new Error('User not authenticated');
  }

  try {
    // Prepare request body
    const requestBody = {
      language,
      limit,
      page
    };

    if (search) {
      requestBody.search = search;
    }

    // Make the API call
    const response = await fetch(
      'https://us-central1-meme-soundboard-viral-alarm.cloudfunctions.net/getAllSoundsMetadata',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.result || !data.result.success || !data.result.data) {
      throw new Error('Invalid response format or no sounds found');
    }

    // Transform the data to match our entity format
    const sounds = data.result.data.map(sound => ({
      id: sound.id,
      name: sound.name,
      hashtags: sound.hastags || [], // Note: API uses 'hastags' with typo
      virality_index: sound.virality_index || 0,
      length: sound.length || 0,
      language: sound.languages ? sound.languages[0] : 'English',
      audio_url: sound.audio_url,
      image_url: sound.image_url
    }));

    // Return the transformed data and pagination info
    return {
      sounds,
      pagination: data.result.pagination
    };
  } catch (error) {
    console.error('Error fetching sounds:', error);
    throw error;
  }
}