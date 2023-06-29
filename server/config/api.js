const axios = require('axios');

const playlist_api = {
    method: 'GET',
    url: 'https://youtube-v31.p.rapidapi.com/playlistItems',
    params: {
      playlistId: 'PLeRj4b8xSv41Lv9dJ1I7Mk8RgQ3Kv1YC_',
      part: 'snippet',
      maxResults: '50',
    },
    headers: {
      'content-type': 'application/octet-stream',
      'X-RapidAPI-Key': 'a82d08bb97msheba6e9257f802b0p163ca7jsn0392ca4ca0a3',
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
    },
  };

  const track_api = {
    method: 'GET',
    url: 'https://spotify-scraper.p.rapidapi.com/v1/track/download',
    params: {
      track: ''
    },
    headers: {
      'X-RapidAPI-Key': '2fef321d6cmsh0f74e95e9acf822p1d23dbjsn42fd38bcce66',
      'X-RapidAPI-Host': 'spotify-scraper.p.rapidapi.com'
    }
  };
  
  const get_playlist = async () => {
    const { data } = await axios.request(playlist_api);
    return data;
  };

  const get_track = async (title) => {
    track_api.params.track = title;
    const { data } = await axios.request(track_api);
    return data;
  };

  module.exports = { get_playlist, get_track };