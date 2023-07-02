import React, { useState, useEffect } from "react";
import "react-h5-audio-player/lib/styles.css";
import { get_playlist } from "./api/API";
import { storage } from "./config/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

import "./App.css";
import Navbar from "./components/Navbar";
import SongList from "./components/SongList";
import UploadSong from "./components/UploadSong";

function App() {
  const [videoData, setVideoData] = useState([]);
  const [audioElement, setAudioElement] = useState();
  const [currentTitle, setCurrentTitle] = useState();
  const [nextSong, setNextSong] = useState();
  const [nextSongUrl, setNextSongUrl] = useState({ title: "", url: "" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  let abortController = new AbortController();

  /**
   * ---------------------------------------------------------------------------
   * Functions: fetchPlaylist, fetchSongUrl
   * Description: These functions are responsible for fetching the playlist data
   *              and retrieving the song URL for a given title.
   * - fetchPlaylist: Asynchronously fetches the playlist and extracts the video data
   *                  (including title and thumbnail URL). Updates the videoData state.
   * - fetchSongUrl: Retrieves the download URL for the given song title from Firebase Storage.
   * Returns: Promise (fetchSongUrl returns a promise that resolves with the song URL)
   * Usage: Call fetchPlaylist to fetch the playlist data and update the videoData state.
   *        Call fetchSongUrl with a song title to retrieve the corresponding song URL.
   * ---------------------------------------------------------------------------
   */

  const fetchPlaylist = async () => {
    try {
      const data= await get_playlist();
      const videoData = data.map((item) => ({
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

  /**
   * ---------------------------------------------------------------------------
   * Functions: pauseAudio, resumeAudio, toggleAudio
   * Description: These functions are responsible for controlling the audio playback.
   * - toggleAudio: Toggles the audio playback based on the provided title. If the provided
   *                title matches the currentTitle state, it toggles between pause and play.
   *                If the provided title is different, it pauses the current audio and plays
   *                the new audio.
   * Returns: None (These functions update state and control audio playback)
   * Usage: Call these functions when a song needs to be played, paused, or resumed.
   * ---------------------------------------------------------------------------
   */
  const pauseAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (audioElement) {
      audioElement.play();
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

  /**
   * ---------------------------------------------------------------------------
   * Function: playNewAudio
   * Description: Plays a new audio with the provided title.
   * - Aborts any in-progress fetch operation.
   * - Checks if the title of the next song URL matches the current title.
   * - Fetches the song URL for the given title and plays the audio.
   * - Updates the audioElement, currentTitle, nextSong, and isPlaying states.
   * - Fetches the URL of the next song and updates nextSongUrl state.
   * Returns: None (This function updates state and plays the audio)
   * Usage: Call this function when a new song needs to be played.
   * ---------------------------------------------------------------------------
   */

  const playNewAudio = (title) => {
    try {
      abortController.abort();
      abortController = new AbortController();
  
      const songUrl =
        nextSongUrl.title === title
          ? nextSongUrl.url
          : fetchSongUrl(title, { signal: abortController.signal });
  
      Promise.resolve(songUrl)
        .then((url) => {
          const newAudioElement = new Audio(url);
          newAudioElement.play();
  
          setAudioElement(newAudioElement);
          setCurrentTitle(title);
          setNextSong(findNextSong(title));
          setIsPlaying(true);
  
          const nextSongTitle = findNextSong(title);
          return fetchSongUrl(nextSongTitle);
        })
        .then((nextSongInfo) => {
          setNextSongUrl(nextSongInfo);
        })
        .catch((error) => {
          console.log('An error occurred while fetching the next song URL in playNewAudio function for title: ' + title + ' ' + error);
        });
    } catch (error) {
      console.log('An error occurred outside of the promise in the playNewAudio function for title: ' + title + ' ' + error);
    }
  };
  

  /**
   * ---------------------------------------------------------------------------
   * Functions: findCurrentSongIndex, findNextSong, skipToNext, skipToPrevious
   * Description: These functions are responsible for finding the current song index,
   *              finding the title of the next song, skipping to the next song,
   *              and skipping to the previous song.
   * Returns: None (These functions retrieve data and control audio playback)
   * Usage: Call these functions when you need to find the current song index,
   *        find the next song title, skip to the next song, or skip to the previous song.
   * ---------------------------------------------------------------------------
   */

  const findCurrentSongIndex = (title) =>
    videoData.findIndex((video) => video.title === title);

  const findNextSong = (title) => {
    const nextIndex = (findCurrentSongIndex(title) + 1) % videoData.length;
    return videoData[nextIndex].title;
  };

  const skipToNext = () => {
    const nextIndex =
      (findCurrentSongIndex(currentTitle) + 1) % videoData.length;
    toggleAudio(videoData[nextIndex].title);
  };

  const skipToPrevious = () => {
    const previousIndex =
      (findCurrentSongIndex(currentTitle) - 1 + videoData.length) %
      videoData.length;
    toggleAudio(videoData[previousIndex].title);
  };

  /**
   * ---------------------------------------------------------------------------
   * Functions: toggleCurrentAudio, toggleAutoplay, handleAudioEnded
   * Description: These functions are responsible for controlling various aspects
   *              of audio playback and handling related events.
   * Returns: None (These functions update state and control audio playback)
   * Usage: Call these functions when you need to toggle the current audio,
   *        toggle the autoplay feature, or handle the audio playback end event.
   * ---------------------------------------------------------------------------
   */
  const toggleCurrentAudio = () => audioElement && toggleAudio(currentTitle);
  const toggleAutoplay = () => setAutoplay(!autoplay);
  const handleAudioEnded = () => autoplay && toggleAudio(nextSong);

  /**
 * ---------------------------------------------------------------------------
 * useEffect Hooks: fetchPlaylist, audioElement
 * Description: These hooks handle side effects and lifecycle events.
 * - fetchPlaylist: Fetches the playlist data once, right after the component is mounted.
 * - audioElement: Adds an event listener for the 'ended' event on the audioElement.
 *                 Cleans up the event listener when the component unmounts.
 * ---------------------------------------------------------------------------
 */
  useEffect(() => {
    fetchPlaylist();
  }, []);
  
  useEffect(() => {
    if (audioElement) {
      audioElement.addEventListener("ended", handleAudioEnded);
      return () => {
        audioElement.removeEventListener("ended", handleAudioEnded);
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
      <UploadSong />
    </div>
  );
}

export default App;
