import axios from 'axios';

export const get_playlist = async () => {
  let allData = [];
  let pageToken = null;

  do {
    const response = await axios({
      method: 'GET',
      url: `https://${process.env.REACT_APP_YOUTUBE_RAPIDAPI_HOST}/playlistItems`,
      params: {
        playlistId: process.env.REACT_APP_YOUTUBE_PLAYLIST_ID,
        part: 'snippet',
        maxResults: '50',
        pageToken: pageToken,
      },
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': process.env.REACT_APP_YOUTUBE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.REACT_APP_YOUTUBE_RAPIDAPI_HOST,
      },
    });

    allData = [...allData, ...response.data.items];
    pageToken = response.data.nextPageToken;
  } while (pageToken);
  return allData;
};
