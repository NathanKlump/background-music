import React, { useState, useEffect } from 'react';
import { get_playlist } from './api/API';

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
      <ul>
        {videoIds.map((videoId, index) => (
          <li key={index}>{videoId}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
