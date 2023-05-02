import React from "react";
import SongProgressBar from "./SongProgressBar";

function Navbar(props) {
  const {
    currentTitle,
    isPlaying,
    skipToPrevious,
    toggleCurrentAudio,
    skipToNext,
    autoplay,
    toggleAutoplay,
    audioElement,
  } = props;

  const truncateTitle = (title, maxLength = 40) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  return (
    <nav className="Navbar">
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white font-bold">
            {currentTitle
              ? `Now playing: ${truncateTitle(currentTitle)}`
              : "No song playing"}
          </div>
        
          <div className="flex items-center space-x-4">
            <svg
              onClick={skipToPrevious}
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="#FFFFFF" d="M6 6h2v12H6zm3.5 6 8.5 6V6z"></path>
            </svg>
            <button onClick={toggleCurrentAudio} className="PauseButton">
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="#FFFFFF"
                    d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                  ></path>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#FFFFFF" d="M8 5v14l11-7z"></path>
                </svg>
              )}
            </button>
            <svg
              onClick={skipToNext}
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="#FFFFFF"
                d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z"
              ></path>
            </svg>
          </div>
        </div>
        <SongProgressBar audioElement={audioElement}></SongProgressBar>
      </div>
    </nav>
  );
}

export default Navbar;
