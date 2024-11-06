import React, { useState, useEffect } from "react";
import "./ResultsGrid.css";
import VideoCard from "./VideoCard";

const ResultsGrid = ({ results, type, loading, videoFormat }) => {
  const [filteredResults, setFilteredResults] = useState(results);

  useEffect(() => {
    setFilteredResults(results); // Update filtered results when results change
  }, [results]);

  return (
    <div>
    
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="masonry-grid">
          {filteredResults.map((item, index) => (
            <div key={index} className="masonry-grid-item">
              {type === "images" ? (
                item.src?.large ? (  // Optional chaining
                  <>
                    <img
                      src={item.src.large}
                      alt={item.alt || "Image"}
                      className="masonry-image"
                      loading="lazy" width={item.width} height={item.height}
                    />
                  </>
                  
                ) : (
                  <div>No image available</div> // Fallback if `large` is undefined
                )
              ) : (
                item.video_files?.length > 0 && <VideoCard video={item} format={videoFormat} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsGrid;