import React, { useState } from "react";
import './VideoCard.css';
import { FaEllipsisV } from "react-icons/fa";

const VideoCard = ({ video, onFilterChange }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);


  const handleFilterChange = (ratio) => {
    onFilterChange(ratio);
    setDropdownVisible(false);
  };

  return (
    <div className="video-card">
      <div className="filter-controls">
        <button id="back" onClick={() => setDropdownVisible(!dropdownVisible)}>
          <FaEllipsisV />
        </button>
        {dropdownVisible && (
          <div className="dropdown-menu">
            <button onClick={() => handleFilterChange("all")}>All</button>
            <button onClick={() => handleFilterChange("landscape")}>Landscape</button>
            <button onClick={() => handleFilterChange("portrait")}>Portrait</button>
            <button onClick={() => handleFilterChange("square")}>Square</button>
          </div>
        )}
      </div>

      <video controls className="video-element">
        <source src={video.video_files[0].link} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-info">
      </div>
    </div>
  );
};

export default VideoCard;