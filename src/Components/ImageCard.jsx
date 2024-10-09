import React from 'react';
import './ImageCard.css'; // Create and import your custom CSS file

const ImageCard = ({ photo }) => {
  return (
    <div className="image-card">
      <img src={photo.src.medium} alt={photo.alt} className="image" />
      <div className="content">
        <p className="photographer">{photo.photographer}</p>
      </div>
    </div>
  );
};

export default ImageCard;
