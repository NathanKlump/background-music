import React, { useState, useEffect } from "react";

function SongProgressBar(props) {
  const [progressPercentage, setProgressPercentage] = useState(0);

  const {
    audioElement, 
    autoplay, 
    currentTitle, 
    toggleAudio, 
    videoData, 
    isNextSongLoading, 
    setIsNextSongLoading
  } = props;
  
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioElement) {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        setProgressPercentage(progress);
    
        if (autoplay && audioElement.duration - audioElement.currentTime <= 2 && !isNextSongLoading) {
          setIsNextSongLoading(true);
          const nextSongTitle = getNextSongTitle(currentTitle);
          toggleAudio(nextSongTitle);
        }
      }
    };

    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [audioElement]);

  const getNextSongTitle = (currentTitle) => {
    const currentIndex = videoData.findIndex((video) => video.title === currentTitle);
    const nextIndex = (currentIndex + 1) % videoData.length;
    return videoData[nextIndex].title;
  };

  const handleProgressBarClick = (event) => {
    if (audioElement && audioElement.duration) {
      const progressBarRect = event.currentTarget.getBoundingClientRect();
      const clickPositionX = event.clientX - progressBarRect.left;
      const newProgressPercentage = (clickPositionX / progressBarRect.width) * 100;
      const newCurrentTime = (newProgressPercentage * audioElement.duration) / 100;

      audioElement.currentTime = newCurrentTime;
    }
  };

  return (
    <div
      className="relative w-full h-1 bg-progGrey cursor-pointer"
      onClick={handleProgressBarClick}
    >
      <div
        className="absolute top-0 left-0 h-1 bg-ltGrey"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
}

export default SongProgressBar;
