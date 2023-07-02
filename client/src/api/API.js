export const get_playlist = async () => {
  try {
    const response = await fetch('http://localhost:3001/playlist');
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
