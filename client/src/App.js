import React, { useState, useEffect } from "react";
import { get_playlist } from "./api/API";
import "react-h5-audio-player/lib/styles.css";
import "./App.css";

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

  const skipToNext = () => {
    const currentIndex = videoData.findIndex((video) => video.title === currentTitle);
    const nextIndex = (currentIndex + 1) % videoData.length;
    toggleAudio(videoData[nextIndex].title);
  };
  
  const skipToPrevious = () => {
    const currentIndex = videoData.findIndex((video) => video.title === currentTitle);
    const previousIndex = (currentIndex - 1 + videoData.length) % videoData.length;
    toggleAudio(videoData[previousIndex].title);
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
      <nav className="Navbar">
        <div className="text-white font-bold">
          {currentTitle
            ? `Now playing: ${truncateTitle(currentTitle)}`
            : "No song playing"}
        </div>
        <div className="flex items-center space-x-4">
          <svg onClick={skipToPrevious} width="24" height="24" viewBox="0 0 24 24">
            <path fill="#FFFFFF" d="M6 6h2v12H6zm3.5 6 8.5 6V6z"></path>
          </svg>
          <button onClick={toggleCurrentAudio} className="PauseButton">
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#FFFFFF" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#FFFFFF" d="M8 5v14l11-7z"></path>
              </svg>
            )}
          </button>
          <svg onClick={skipToNext} width="24" height="24" viewBox="0 0 24 24">
            <path fill="#FFFFFF" d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z"></path>
          </svg>
        </div>
      </nav>
      <div className="pt-20">
        {videoData.map((video, index) => (
          <>
            <div
              className="video-item flex items-center space-x-4 cursor-pointer m-2"
              key={index}
              onClick={() => toggleAudio(video.title)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-16 h-16 object-cover"
              />
              <p className="text-white font-semibold">
                {truncateTitle(video.title)}
              </p>
            </div>
            <div class="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>
          </>
        ))}
      </div>
    </div>
  );
}

export default App;
