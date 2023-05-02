import React, { useState, useEffect } from "react";
import { get_playlist } from "./api/API";
import "react-h5-audio-player/lib/styles.css";
import "./App.css";
import Navbar from "./components/Navbar";
import SongList from "./components/SongList";

function App() {
  const [videoData, setVideoData] = useState([]);
  const [audioElement, setAudioElement] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayQueue, setAutoplayQueue] = useState(null);

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
        audioElement.removeEventListener('ended', handlePlaybackEnded);
      }

      const newAudioElement = new Audio(`/audio/${title}.mp3`);
      newAudioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
      });

      setAudioElement(newAudioElement);
      setCurrentTitle(title);
      setIsPlaying(true);
      setAutoplayQueue(getNextSongTitle(currentTitle));

      newAudioElement.addEventListener('ended', handlePlaybackEnded);
    }
  };

  const handlePlaybackEnded = () => {
    if (autoplay) {
      toggleAudio(autoplayQueue);
    }
  };
  
  const skipToNext = () => {
    console.log(getNextSongTitle(currentTitle))
    const currentIndex = videoData.findIndex((video) => video.title === currentTitle);
    const nextIndex = (currentIndex + 1) % videoData.length;
    toggleAudio(videoData[nextIndex].title);
  };
  
  const skipToPrevious = () => {
    const currentIndex = videoData.findIndex((video) => video.title === currentTitle);
    const previousIndex = (currentIndex - 1 + videoData.length) % videoData.length;
    toggleAudio(videoData[previousIndex].title);
  };

  const getNextSongTitle = (currentTitle) => {
    const currentIndex = videoData.findIndex((video) => video.title === currentTitle);
    const nextIndex = (currentIndex + 1) % videoData.length;
    return videoData[nextIndex].title;
  };

  const toggleCurrentAudio = () => {
    if (audioElement) {
      toggleAudio(currentTitle);
    }
  };

  const toggleAutoplay = () => {
    setAutoplay(!autoplay)
  }

  return (
    <div className="App">
      <Navbar
        currentTitle={currentTitle}
        isPlaying={isPlaying}
        skipToPrevious={skipToPrevious}
        toggleCurrentAudio={toggleCurrentAudio}
        skipToNext={skipToNext}
        autoplay={autoplay}
        toggleAutoplay={toggleAutoplay}
        audioElement={audioElement}
      />
      <SongList 
        videoData={videoData} 
        toggleAudio={toggleAudio} 
        currentTitle={currentTitle} />
    </div>
  );
}

export default App;
