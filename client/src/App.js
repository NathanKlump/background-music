import React, { useState, useEffect } from 'react';
import { get_playlist, get_download_link } from './api/API';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import song from './audio/test.mp3'

function App() {
  const [videoIds, setVideoIds] = useState([]);

  const extractVideoIds = responseObject => {
    const items = responseObject.items;
    const videoIds = [];

    for (let i = 0; i < items.length; i++) {
      const videoId = items[i].snippet.resourceId.videoId;
      videoIds.push(videoId);
    }

    return videoIds;
  };

  const testDownloadLink = async () => {
    try {
      const downloadData = await get_download_link();
      console.log('Download link:', downloadData.link);
    } catch (err) {
      console.log('Error fetching download link:', err);
    }
  };

  useEffect(() => {
    const getPlaylist = () => {
      get_playlist()
        .then(data => {
          const ids = extractVideoIds(data);
          setVideoIds(ids);
        })
        .catch(err => {
          console.log(err);
        });
    };

    getPlaylist();
  }, []);
  return (
    <div className="App">
      <AudioPlayer
        src={song}
        autoPlay={false}
        controls
      />
    </div>
  );
}

export default App;
