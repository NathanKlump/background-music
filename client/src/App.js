import React, { useState, useEffect } from 'react';
import { get_playlist } from './api/API';
import 'react-h5-audio-player/lib/styles.css';

function App() {
  const [videoTitles, setVideoTitles] = useState([]);
  const [audioElement, setAudioElement] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const extractVideoTitles = responseObject => {
    const items = responseObject.items;
    const videoTitles = [];
    console.log(items);
    for (let i = 0; i < items.length; i++) {
      const videoTitle = items[i].snippet.title;
      videoTitles.push(videoTitle);
    }
    return videoTitles;
  };

  useEffect(() => {
    const getPlaylist = () => {
      get_playlist()
        .then(data => {
          const titles = extractVideoTitles(data);
          setVideoTitles(titles);
        })
        .catch(err => {
          console.log(err);
        });
    };

    getPlaylist();
  }, []);

  const toggleAudio = (title) => {
    if (currentTitle === title) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      if (audioElement) {
        audioElement.pause();
      }

      const newAudioElement = new Audio(`/audio/${title}.mp3`);
      newAudioElement.play().catch((error) => {
        console.error('Error playing audio:', error);
      });

      setAudioElement(newAudioElement);
      setCurrentTitle(title);
      setIsPlaying(true);
    }
  };

  return (
    <div className="App">
      {videoTitles.map((title, index) => (
        <div key={index} onClick={() => toggleAudio(title)}>
          <p>{title}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
