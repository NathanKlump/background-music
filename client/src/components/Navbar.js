import React from "react";
import SongProgressBar from "./SongProgressBar";
import ShuffleButton from "./ShuffleButton";

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
    setVideoData,
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
        <div className="text-white font-bold mb-2 text-center">
          {currentTitle ? `${truncateTitle(currentTitle)}` : "No song playing"}
        </div>
        <SongProgressBar
          audioElement={audioElement}
          autoplay={autoplay}
          currentTitle={currentTitle}
          toggleAudio={toggleAudio}
          videoData={videoData}
        />
        <div className="flex items-center justify-between mt-2">
          <button onClick={toggleAutoplay} className="font-bold">
            {autoplay ? (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#FFFFFF"
                  d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
                ></path>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#FFFFFF"
                  d="M10 6.35V4.26c-.8.21-1.55.54-2.23.96l1.46 1.46c.25-.12.5-.24.77-.33zm-7.14-.94 2.36 2.36C4.45 8.99 4 10.44 4 12c0 2.21.91 4.2 2.36 5.64L4 20h6v-6l-2.24 2.24C6.68 15.15 6 13.66 6 12c0-1 .25-1.94.68-2.77l8.08 8.08c-.25.13-.5.25-.77.34v2.09c.8-.21 1.55-.54 2.23-.96l2.36 2.36 1.27-1.27L4.14 4.14 2.86 5.41zM20 4h-6v6l2.24-2.24C17.32 8.85 18 10.34 18 12c0 1-.25 1.94-.68 2.77l1.46 1.46C19.55 15.01 20 13.56 20 12c0-2.21-.91-4.2-2.36-5.64L20 4z"
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
          <div>
            <ShuffleButton videoData={videoData} setVideoData={setVideoData} />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
