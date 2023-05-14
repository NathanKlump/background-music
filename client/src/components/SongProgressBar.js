import React, { useState, useEffect } from "react";

function SongProgressBar(props) {
  const [progressPercentage, setProgressPercentage] = useState(0);

  const {
    audioElement, 
  } = props;
  
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioElement) {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        setProgressPercentage(progress);
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
