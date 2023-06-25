import axios from 'axios';

const base_api = {
  method: 'GET',
  headers: {
    'content-type': 'application/octet-stream',
    'X-RapidAPI-Key': 'a82d08bb97msheba6e9257f802b0p163ca7jsn0392ca4ca0a3',
  },
};

// Function to get the list of videos from a playlist. Uses the YouTube Data API.
export const get_playlist = async (pageToken) => {
  const { data } = await axios.request({
    ...base_api,
    url: 'https://youtube-v31.p.rapidapi.com/playlistItems',
    params: {
      playlistId: 'PLeRj4b8xSv41Lv9dJ1I7Mk8RgQ3Kv1YC_',
      part: 'snippet',
      maxResults: '50',
      pageToken: pageToken,
    },
    headers: {
      ...base_api.headers,
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
    },
  });

  if (data.nextPageToken) {
    const nextPageData = await get_playlist(data.nextPageToken);
    data.items = data.items.concat(nextPageData.items);
  }

  return data;
};

// Function to get the download link for a video. Uses the YouTube MP3 download API.
export const get_download_link = async (videoId) => {
  const { data } = await axios.request({
    ...base_api,
    url: 'https://youtube-mp36.p.rapidapi.com/dl',
    params: {id: videoId},
    headers: {
      ...base_api.headers,
      'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
    },
  });

  return data;
};

// Call functions
get_playlist().then((data) => {
  console.log(data);
}).catch((error) => {
  console.error(error);
});

get_download_link('UxxajLWwzqY').then((data) => {
  console.log(data);
}).catch((error) => {
  console.error(error);
});
