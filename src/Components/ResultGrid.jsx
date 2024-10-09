import React, { useState, useEffect, useCallback } from "react";
import "./ResultsGrid.css";
import VideoCard from "./VideoCard";

const ResultsGrid = ({ results, type }) => {
  const [aspectRatio, setAspectRatio] = useState("all");
  const [filteredResults, setFilteredResults] = useState(results);
  const [fullscreenItem, setFullscreenItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = useCallback((ratio) => {
    setLoading(true);
    setAspectRatio(ratio);
  }, []);

  useEffect(() => {
    const filterResults = () => {
      if (aspectRatio === "all" || type !== "videos") {
        setFilteredResults(results);
      } else {
        setFilteredResults(
          results.filter((item) => {
            if (item.video_files?.length > 0) {
              const { width, height } = item.video_files[0];
              if (aspectRatio === "landscape") return width > height;
              if (aspectRatio === "portrait") return height > width;
              if (aspectRatio === "square") return width === height;
            }
            return true;
          })
        );
      }
      setLoading(false);
    };

    const timer = setTimeout(filterResults, 500);
    return () => clearTimeout(timer);
  }, [aspectRatio, results, type]);

  const handleFullscreen = useCallback((src, mediaType) => {
    setFullscreenItem({ src, mediaType });
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenItem(null);
  }, []);

  return (
    <>
      {loading ? (
        <div>Loading results...</div>
      ) : (
        <div className="masonry-grid">
          {filteredResults.map((item, index) => (
            <div key={index} className="masonry-grid-item">
              {type === "images" ? (
                item.src?.large ? (
                  <img
                    src={item.src.large}
                    alt={item.alt || "Image"}
                    className="masonry-image"
                    onClick={() => handleFullscreen(item.src.large, "image")}
                    loading="lazy"
                  />
                ) : (
                  <div>No Image Available</div>
                )
              ) : (
                item.video_files?.length > 0 && (
                  <VideoCard video={item} onFilterChange={handleFilterChange} />
                )
              )}
            </div>
          ))}
        </div>
      )}

      {fullscreenItem && (
        <div className="fullscreen-modal" onClick={closeFullscreen}>
          <span className="close-modal">&times;</span>
          {fullscreenItem.mediaType === "image" ? (
            <img
              src={fullscreenItem.src}
              alt="Fullscreen"
              className="fullscreen-image"
            />
          ) : (
            <video
              src={fullscreenItem.src}
              className="fullscreen-video"
              controls
            />
          )}
        </div>
      )}
    </>
  );
};

export default ResultsGrid;