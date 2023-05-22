import React, { useRef, useState, useEffect } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebaseConfig";

const UploadSong = () => {
  const [songUpload, setSongUpload] = useState(null);
  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

const handleFileChange = (event) => {
  const file = event.target.files[0];
  const allowedTypes = ["audio/mpeg", "audio/mp3"];

  if (file && allowedTypes.includes(file.type)) {
    setSongUpload(file);
  } else {
    // Handle error - file is not an MP3
    alert("Please select an MP3 file.");
  }
};


  useEffect(() => {
    if (songUpload) {
      uploadSong();
    }
  }, [songUpload]);

  const uploadSong = () => {
    const songRef = ref(storage, `public/${songUpload.name}`);
    uploadBytes(songRef, songUpload).then(() => {
      alert("Song uploaded");
      setSongUpload(null);
    });
  };

  return (
    <div className="video-item flex items-center cursor-pointer m-2">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        onClick={handleButtonClick}
        className="w-16 h-16 object-cover"
      >
        <path
          fill="#FFFFFF"
          d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"
        ></path>
      </svg>
      <p
        className="text-white font-semibold pl-4 w-full"
        onClick={handleButtonClick}
      >
        Add a new song file
      </p>
    </div>
  );
};

export default UploadSong;
