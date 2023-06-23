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
  const [nextSongUrl, setNextSongUrl] = useState({ title: '', url: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  let abortController = new AbortController();

  /**
 * ---------------------------------------------------------------------------
 * Function: fetchPlaylist
 * Description: This function asynchronously fetches the playlist and extracts
 *              the video data (including title and thumbnail URL).
 *              It then updates the videoData state with the extracted data.
 * Returns: None (This is a side-effect function which updates state)
 * Usage: Call this function whenever the playlist data needs to be fetched
 *        and the videoData state needs to be updated.
 * ---------------------------------------------------------------------------
 */
  const fetchPlaylist = async () => {
    try {
      const data = await get_playlist();
      const items = data.items;
      const videoData = items.map((item) => ({
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));
      setVideoData(videoData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSongUrl = (title) => {
    const songRef = ref(storage, `public/${title}.mp3`);
    return getDownloadURL(songRef)
      .then((url) => {
        return url;
      })
      .catch((error) => {
        console.error("Error getting song download URL:", error);
      });
  };

  // Audio control functions
  const pauseAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (audioElement) {
      audioElement.play()
      setIsPlaying(true);
    }
  };

  const toggleAudio = (title) => {
    if (currentTitle === title) {
      isPlaying ? pauseAudio() : resumeAudio();
    } else {
      pauseAudio();
      playNewAudio(title);
    }
  };

  const playNewAudio = (title) => {
    // Abort any in-progress fetch operation
    abortController.abort();
    abortController = new AbortController();
  
    // Check if the title of the next song URL matches the current title
    const songUrl = (nextSongUrl.title === title) ? nextSongUrl.url : fetchSongUrl(title, { signal: abortController.signal });
    
    Promise.resolve(songUrl)
      .then((url) => {
        const newAudioElement = new Audio(url);        
        newAudioElement.play()
  
        setAudioElement(newAudioElement);
        setCurrentTitle(title);
        setNextSong(findNextSong(title));
        setIsPlaying(true);
  
        // Fetch the URL of the next song and update nextSongUrl state
        const nextSongTitle = findNextSong(title);
        return fetchSongUrl(nextSongTitle);
      })
      .then((nextSongInfo) => {
        // nextSongInfo is an object with title and url properties
        setNextSongUrl(nextSongInfo);
      })
  };

  const findCurrentSongIndex = (title) => videoData.findIndex((video) => video.title === title);

  const findNextSong = (title) => {
    const nextIndex = (findCurrentSongIndex(title) + 1) % videoData.length;
    return videoData[nextIndex].title;
  };
  
  const skipToNext = () => {
    const nextIndex = (findCurrentSongIndex(currentTitle) + 1) % videoData.length;
    toggleAudio(videoData[nextIndex].title);
  };
  
  const skipToPrevious = () => {
    const previousIndex = (findCurrentSongIndex(currentTitle) - 1 + videoData.length) % videoData.length;
    toggleAudio(videoData[previousIndex].title);
  };
  
  const toggleCurrentAudio = () => audioElement && toggleAudio(currentTitle);
  const toggleAutoplay = () => setAutoplay(!autoplay);
  const handleAudioEnded = () => autoplay && toggleAudio(nextSong);
  

  // useEffects
  useEffect(() => {
    fetchPlaylist();
  }, []);

  useEffect(() => {
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnded);
      return () => {
        audioElement.removeEventListener('ended', handleAudioEnded);
      };
    }
  }, [audioElement]);

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
        toggleAudio={toggleAudio}
        videoData={videoData}
        setVideoData={setVideoData}
      />
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
