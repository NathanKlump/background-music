import React from "react";
import SongProgressBar from "./SongProgressBar";
import ShuffleButton from "./ShuffleButton";
import Modal from "./Modal";

// ******************* COMPONENT ******************* //

// Navbar component
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

  const [isModalVisible, setModalVisible] = React.useState(false);

  const openModal = () => {setModalVisible(true)}
  const closeModal = () => {setModalVisible(false)}

  const truncateTitle = (title, maxLength = 40) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  // ******************* RENDER ******************* //

  return (
    <nav className="Navbar">
      
      {/* ******************* Title Section ******************* */}
      <div className="w-full">
        {/* Song title */}
        <div className="text-white font-bold mb-2 text-center">
          {currentTitle ? `${truncateTitle(currentTitle)}` : "No song selected"}
        </div>
        
        {/* ******************* Song Progress Bar Section ******************* */}
        <SongProgressBar
          audioElement={audioElement}
          autoplay={autoplay}
          currentTitle={currentTitle}
          toggleAudio={toggleAudio}
          videoData={videoData}
        />
        
        {/* ******************* Controls Section ******************* */}
        <div className="flex items-center justify-between mt-2">
          
          {/* ******************* Modal ******************* */}
          {isModalVisible ? (
            <div className="w-6">
            <Modal
              autoplay={autoplay}
              toggleAutoplay={toggleAutoplay}
              isModalVisible={isModalVisible}
              closeModal={closeModal}
            />
            </div>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" onClick={openModal}>
              <path
                fill="#FFFFFF"
                d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"
              ></path>
            </svg>
          )}
          
          {/* ******************* Playback Controls ******************* */}
          <div className="flex items-center space-x-4">
            
            {/* Skip to Previous */}
            <svg
              onClick={skipToPrevious}
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="#FFFFFF" d="M6 6h2v12H6zm3.5 6 8.5 6V6z"></path>
            </svg>
            
            {/* Toggle Current Audio (Play/Pause) */}
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
            
            {/* Skip to Next */}
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
            
          </div> {/* End of Playback Controls */}
          
          {/* Shuffle Button */}
          <div>
            <ShuffleButton videoData={videoData} setVideoData={setVideoData} />
          </div>
          
        </div> {/* End of Controls Section */}
        
      </div> {/* End of Navbar */}
      
    </nav>
  );
}

export default Navbar;
