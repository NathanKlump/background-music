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
    toggleAudio,
    videoData,
    isNextSongLoading,
    setIsNextSongLoading,
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
          <button onClick={toggleAutoplay} className="font-bold">
            {autoplay ? (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#FFFFFF"
                  d="m19 8-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"
                ></path>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#2f2f2f"
                  d="m19 8-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"
                ></path>
              </svg>
            )}
          </button>
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
        <SongProgressBar
          audioElement={audioElement}
          autoplay={autoplay}
          currentTitle={currentTitle}
          toggleAudio={toggleAudio}
          videoData={videoData}
          isNextSongLoading={isNextSongLoading}
          setIsNextSongLoading={setIsNextSongLoading}
        />
      </div>
    </nav>
  );
}

export default Navbar;
