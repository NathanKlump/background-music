import React, { useState } from 'react';

const VolumeSlider = (props) => {
  const [volume, setVolume] = useState(0.5);

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);

    // If a callback is provided, call it with the new volume value
    if (props.onVolumeChange) {
      props.onVolumeChange(newVolume);
    }
  };

  return (
    <div>
      <input
        type="range"
        min="0"
        max="1"
        value={volume}
        onChange={handleVolumeChange}
        step="0.01"
      />
      <p>Volume: {(volume * 100).toFixed(0)}%</p>
    </div>
  );
};

export default VolumeSlider;
