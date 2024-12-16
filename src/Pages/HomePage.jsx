import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../Components/SearchBar";
import ResultsGrid from "../Components/ResultGrid";
import { searchPhotos, searchVideos } from "../Service/api";
import { useInView } from "react-intersection-observer";
import useDebounce from "../Hooks/useDebounce";
import "./HomePage.css";

const DEFAULT_QUERY = "nature";

const HomePage = () => {
  const [results, setResults] = useState([]);
  const [type, setType] = useState("images");
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [videoFormat, setVideoFormat] = useState("All");
  const [imageFormat, setImageFormat] = useState("All");
  const { ref, inView } = useInView();

  const debouncedQuery = useDebounce(query, 500);

  const fetchContent = useCallback(
    async (searchQuery, pageNum, format) => {
      setLoading(true);
      try {
        let newResults = [];

        if (type === "images") {
          const fetchedImages = await searchPhotos(searchQuery, pageNum, 15, format);
          newResults = fetchedImages;
        } else if (type === "videos") {
          const fetchedVideos = await searchVideos(searchQuery, pageNum, 5, format);
          newResults = fetchedVideos;
        }

        if (newResults.length === 0) {
          setHasMore(false);
        } else {
          setResults((prevResults) =>
            pageNum === 1 ? newResults : [...prevResults, ...newResults]
          );
          setHasMore(newResults.length > 0);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [type, videoFormat, imageFormat]
  );

  useEffect(() => {
    setPage(1);
    setResults([]);
    fetchContent(debouncedQuery || DEFAULT_QUERY, 1, videoFormat);
  }, [debouncedQuery, type, videoFormat, imageFormat, fetchContent]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchContent(debouncedQuery || DEFAULT_QUERY, page + 1, videoFormat);
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore, loading, fetchContent, debouncedQuery, page]);

  const handleSearch = useCallback((newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setResults([]);
    setHasMore(true);
  }, []);

  const handleTypeChange = useCallback(
    (newType) => {
      setType(newType);
      setVideoFormat("All");
      setImageFormat("All");
      setPage(1);
      setResults([]);
      fetchContent(debouncedQuery || DEFAULT_QUERY, 1, videoFormat);
    },
    [debouncedQuery, fetchContent, videoFormat]
  );

  const handleVideoFormatChange = (event) => {
    const newFormat = event.target.value;
    setVideoFormat(newFormat);
    setPage(1);
    setResults([]);
    setHasMore(true);
    fetchContent(debouncedQuery || DEFAULT_QUERY, 1, videoFormat);
  };

  const handleImageFormatChange = (event) => {
    const newFormat = event.target.value;
    setImageFormat(newFormat);
    setPage(1);
    setResults([]);
    setHasMore(true);
    fetchContent(debouncedQuery || DEFAULT_QUERY, 1);
  };

  /* const filterVideosByFormat = (videos, format) => {
    return videos.filter((video) => {
      // Ensure video has files
      if (!video.video_files || video.video_files.length === 0) return false;
  
      // Find the best video file for aspect ratio calculation
      const videoFile = video.video_files.reduce((max, file) =>
        file.height > max.height ? file : max
      );
  
      const { width, height } = videoFile;
      const aspectRatio = width / height;
  
      switch (format) {
        case "Horizontal": 
          // Landscape: width > height
          return width > height;
        case "Vertical": 
          // Portrait: height > width
          return height > width;
        default: 
          return true;
      }
    });
  }; */

  const filterImagesByFormat = (images, format) => {
    return images.filter((image) => {
      const { width, height } = image;
      const aspectRatio = width / height;

      switch (format) {
        case "Horizontal":
          return aspectRatio > 1; // Landscape
        case "Vertical":
          return aspectRatio < 1; // Portrait
        default:
          return true;
      }
    });
  };

  return (
    <div className="homepage-container">
      <div className="content-header">
        <div className="button-group">
          <button
            className={`button ${type === "images" ? "active" : ""}`}
            onClick={() => handleTypeChange("images")}
          >
            Images
          </button>
          <button
            className={`button ${type === "videos" ? "active" : ""}`}
            onClick={() => handleTypeChange("videos")}
          >
            Videos
          </button>
        </div>
        {/* {type === "videos" && ( */}
        <select
          value={videoFormat}
          onChange={handleVideoFormatChange}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Horizontal">Horizontal (Landscape)</option>
          <option value="Vertical">Vertical (Portrait)</option>
        </select>
        {/* )} */}
        {/* {type === "images" && (
          <select
            value={imageFormat}
            onChange={handleImageFormatChange}
            className="filter-select"
          >
            <option value="All">All</option>
            <option value="Horizontal">Horizontal (Landscape)</option>
            <option value="Vertical">Vertical (Portrait)</option>
          </select>
        )} */}
      </div>

      <SearchBar onSearch={handleSearch} defaultQuery={DEFAULT_QUERY} />

      <ResultsGrid results={results} type={type} />

      <div ref={ref} className="loading-container">
        {loading && <p>Loading more results...</p>}
        {!hasMore && !loading && results.length > 0 && (
          <p>No more results to show.</p>
        )}
        {results.length === 0 && !loading && <p>No results found.</p>}
      </div>
    </div>
  );
};

export default HomePage;

