const axios = require('axios');

const playlist_api = {
    method: 'GET',
    url: 'https://youtube-v31.p.rapidapi.com/playlistItems',
    params: {
      playlistId: 'PLeRj4b8xSv41Lv9dJ1I7Mk8RgQ3Kv1YC_',
      part: 'snippet',
      maxResults: '500',
    },
    headers: {
      'content-type': 'application/octet-stream',
      'X-RapidAPI-Key': 'a82d08bb97msheba6e9257f802b0p163ca7jsn0392ca4ca0a3',
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
    },
  };
  
  const get_playlist = async () => {
    const { data } = await axios.request(playlist_api);
    return data;
  };

  module.exports = { get_playlist };