const base_url = 'https://background-music.onrender.com';

export const get_playlist = async () => {
  try {
    const response = await fetch(`${base_url}/playlist`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
