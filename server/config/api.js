const axios = require('axios');

const get_playlist = async () => {
  let allData = [];
  let pageToken = null;

  do {
    const response = await axios({
      method: 'GET',
      url: 'https://youtube-v31.p.rapidapi.com/playlistItems',
      params: {
        playlistId: 'PLeRj4b8xSv41Lv9dJ1I7Mk8RgQ3Kv1YC_',
        part: 'snippet',
        maxResults: '50',
        pageToken: pageToken,
      },
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': 'a82d08bb97msheba6e9257f802b0p163ca7jsn0392ca4ca0a3',
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
      },
    });

    allData = [...allData, ...response.data.items];
    pageToken = response.data.nextPageToken;
  } while (pageToken);
  return allData;
};

  const track_api = {
    method: 'GET',
    url: 'https://spotify-scraper.p.rapidapi.com/v1/track/download',
    params: {
      track: ''
    },
    headers: {
      'X-RapidAPI-Key': 'ebe6fc0e27msh67e1521d5efc9bfp15db2ejsn1b9bd743de9b',
      'X-RapidAPI-Host': 'spotify-scraper.p.rapidapi.com'
    }
  };

  const get_track = async (title) => {
    track_api.params.track = title;
    const { data } = await axios.request(track_api);
    return data;
  };

  module.exports = { get_playlist, get_track };