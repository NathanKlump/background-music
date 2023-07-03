require('dotenv').config();
const axios = require('axios');

const get_playlist = async () => {
  let allData = [];
  let pageToken = null;

  do {
    const response = await axios({
      method: 'GET',
      url: `https://${process.env.YOUTUBE_RAPIDAPI_HOST}/playlistItems`,
      params: {
        playlistId: process.env.YOUTUBE_PLAYLIST_ID,
        part: 'snippet',
        maxResults: '50',
        pageToken: pageToken,
      },
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': process.env.YOUTUBE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.YOUTUBE_RAPIDAPI_HOST,
      },
    });

    allData = [...allData, ...response.data.items];
    pageToken = response.data.nextPageToken;
  } while (pageToken);
  return allData;
};

const track_api = {
  method: 'GET',
  url: `https://${process.env.SPOTIFY_RAPIDAPI_HOST}/v1/track/download`,
  params: {
    track: ''
  },
  headers: {
    'X-RapidAPI-Key': process.env.YOUTUBE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': process.env.SPOTIFY_RAPIDAPI_HOST,
  }
};

const get_track = async (title) => {
  track_api.params.track = title;
  const { data } = await axios.request(track_api);
  return data;
};

module.exports = { get_playlist, get_track };
