import axios from 'axios';

export const get_playlist = async () => {
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
  console.log(allData)
  return allData;
};
