import React from "react";

function SongList(props) {
  const { videoData, toggleAudio, currentTitle } = props;

  const truncateTitle = (title, maxLength = 32) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  return (
    <div className="pt-28">
      {videoData.map((video, index) => (
        <>
          <div
            className={`video-item flex items-center space-x-4 cursor-pointer m-2 ${
              currentTitle === video.title ? "bg-gray-700" : ""
            }`}
            key={index}
            onClick={() => toggleAudio(video.title)}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-16 h-16 object-cover"
            />
            <p className="text-white font-semibold">
              {truncateTitle(video.title)}
            </p>
          </div>
          <div class="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>
        </>
      ))}
    </div>
  );
}

export default SongList;
