import React, { useState, useEffect } from "react";
import { get_playlist } from "./api/API";
import "react-h5-audio-player/lib/styles.css";

function App() {
  const [videoData, setVideoData] = useState([]);
  const [audioElement, setAudioElement] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const extractVideoData = (responseObject) => {
    const items = responseObject.items;
    const videoData = [];
    for (let i = 0; i < items.length; i++) {
      const videoTitle = items[i].snippet.title;
      const thumbnailUrl = items[i].snippet.thumbnails.medium.url;
      videoData.push({ title: videoTitle, thumbnail: thumbnailUrl });
    }
    return videoData;
  };

  useEffect(() => {
    const getPlaylist = () => {
      get_playlist()
        .then((data) => {
          const videoData = extractVideoData(data);
          setVideoData(videoData);
        })
        .catch((err) => {
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
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      if (audioElement) {
        audioElement.pause();
      }

      const newAudioElement = new Audio(`/audio/${title}.mp3`);
      newAudioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
      });

      setAudioElement(newAudioElement);
      setCurrentTitle(title);
      setIsPlaying(true);
    }
  };

  const toggleCurrentAudio = () => {
    if (audioElement) {
      toggleAudio(currentTitle);
    }
  };

  const truncateTitle = (title, maxLength = 40) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  return (
    <div className="App">
      <nav className="bg-gray-800 p-4 flex justify-between items-center fixed top-0 w-full">
        <div className="text-white font-bold">
          {currentTitle ? `Now playing: ${truncateTitle(currentTitle)}` : "No song playing"}
        </div>
        <button
          onClick={toggleCurrentAudio}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isPlaying ? "Pause" : "Resume"}
        </button>
      </nav>
      <div className="pt-16">
      {videoData.map((video, index) => (
        <div
          key={index}
          className="video-item flex items-center space-x-4 cursor-pointer"
          onClick={() => toggleAudio(video.title)}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-8 h-8 object-cover"
          />
          <p>{truncateTitle(video.title)}</p>
        </div>
      ))}
      </div>
    </div>
  );
}

export default App;
