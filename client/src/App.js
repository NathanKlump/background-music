import React, { useState, useEffect } from "react";
import "react-h5-audio-player/lib/styles.css";
import { get_playlist } from "./api/API";
import { storage } from './config/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';


import "./App.css";
import Navbar from "./components/Navbar";
import SongList from "./components/SongList";
import UploadSong from "./components/UploadSong";

function App() {
  const [videoData, setVideoData] = useState([]);
  const [audioElement, setAudioElement] = useState();
  const [currentTitle, setCurrentTitle] = useState();
  const [nextSong, setNextSong] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  // Extract video data from the response object
  const extractVideoData = (responseObject) => {
    const items = responseObject.items;
    const videoData = items.map((item) => ({
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
    return videoData;
  };

  // Fetch playlist data when the component mounts
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const data = await get_playlist();
        const extractedData = extractVideoData(data);
        setVideoData(extractedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlaylist();
  }, []);

  // Toggle audio playback
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
  
      const songRef = ref(storage, `public/${title}.mp3`); // Update the Firebase Storage path
      getDownloadURL(songRef)
        .then((url) => {
          const newAudioElement = new Audio(url);
          newAudioElement.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
  
          setAudioElement(newAudioElement);
          setCurrentTitle(title);
          setNextSong(findNextSong(title));
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error getting song download URL:", error);
        });
    }
  };
  

  const findNextSong = (title) => {
    const currentIndex = videoData.findIndex(
      (video) => video.title === title
    );
    const nextIndex = (currentIndex + 1) % videoData.length;
    return videoData[nextIndex].title;
  }
  // Skip to the next video
  const skipToNext = () => {
    const currentIndex = videoData.findIndex(
      (video) => video.title === currentTitle
    );
    const nextIndex = (currentIndex + 1) % videoData.length;
    toggleAudio(videoData[nextIndex].title);
  };

  // Skip to the previous video
  const skipToPrevious = () => {
    const currentIndex = videoData.findIndex(
      (video) => video.title === currentTitle
    );
    const previousIndex = (currentIndex - 1 + videoData.length) % videoData.length;
    toggleAudio(videoData[previousIndex].title);
  };

  // Toggle the currently playing audio
  const toggleCurrentAudio = () => {
    if (audioElement) {
      toggleAudio(currentTitle);
    }
  };

  // Toggle autoplay
  const toggleAutoplay = () => {
    setAutoplay(!autoplay);
  };

  // Handle audio playback ended event
  const handleAudioEnded = () => {
    // Perform actions when audio playback is finished
    if(autoplay) {
    toggleAudio(nextSong);
    }
  };

  useEffect(() => {
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [audioElement]);

  return (
    <div className="App">
      {currentTitle &&
      <Navbar
      currentTitle={currentTitle}
      isPlaying={isPlaying}
      skipToPrevious={skipToPrevious}
      toggleCurrentAudio={toggleCurrentAudio}
      skipToNext={skipToNext}
      autoplay={autoplay}
      toggleAutoplay={toggleAutoplay}
      audioElement={audioElement}
      toggleAudio={toggleAudio}
      videoData={videoData}
      setVideoData={setVideoData}
    />
      }
      <SongList 
        videoData={videoData} 
        toggleAudio={toggleAudio} 
        currentTitle={currentTitle} 
      />  
      <UploadSong/>

    </div>
  );
}

export default App;
