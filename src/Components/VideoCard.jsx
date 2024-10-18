import React from "react";
import './VideoCard.css';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <video controls className="video-element">
        <source src={video.video_files[0].link} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-info">
        {/* Additional video info can be displayed here if needed */}
      </div>
    </div>
  );
};

export default VideoCard;
