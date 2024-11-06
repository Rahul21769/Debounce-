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
  const { ref, inView } = useInView();

  const debouncedQuery = useDebounce(query, 500);

  // Log the fetched video data to inspect the structure
  const logVideoData = (videoData) => {
    console.log("Fetched video data:", videoData);
  };

  // Fetch content based on type (images/videos) and format (for videos)
  const fetchContent = useCallback(
    async (searchQuery, pageNum) => {
      setLoading(true);
      try {
        let newResults = [];
  
        // Fetch images when type is "images"
        if (type === "images") {
          newResults = await searchPhotos(searchQuery, pageNum);
        } else if (type === "videos") {
          const fetchedVideos = await searchVideos(searchQuery, pageNum);
  
          // Log the video data to check structure
          logVideoData(fetchedVideos);
  
          // Apply filtering for videos based on the selected format
          newResults =
            videoFormat !== "All"
              ? filterVideosByFormat(fetchedVideos, videoFormat)
              : fetchedVideos;
        }
  
        if (newResults.length === 0) {
          setHasMore(false); // No more results available
        } else {
          setResults((prevResults) =>
            pageNum === 1 ? newResults : [...prevResults, ...newResults]
          );
          setHasMore(newResults.length > 0); // Set hasMore based on the results length
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [type, videoFormat] // Re-run the function when type or videoFormat changes
  );
  

  useEffect(() => {
    setPage(1); // Reset page on query or type change
    setResults([]); // Clear results when changing query/type
    fetchContent(debouncedQuery || DEFAULT_QUERY, 1);
  }, [debouncedQuery, type, videoFormat, fetchContent]); // Added videoFormat as a dependency

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchContent(debouncedQuery || DEFAULT_QUERY, page + 1);
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
      setVideoFormat("All"); // Reset video format filter when switching type
      setPage(1);
      setResults([]);
      fetchContent(debouncedQuery || DEFAULT_QUERY, 1);
    },
    [debouncedQuery, fetchContent]
  );

  const handleFormatChange = (event) => {
    const newFormat = event.target.value;
    setVideoFormat(newFormat);
    setPage(1); // Reset page when changing video format
    setResults([]); // Clear previous results
    setHasMore(true); // Reset 'hasMore' flag for fresh fetch
    fetchContent(debouncedQuery || DEFAULT_QUERY, 1); // Fetch new data for the selected format
  };
  

  // Function to filter videos based on their format (Landscape, Portrait, Square)
  const filterVideosByFormat = (videos, format) => {
    return videos.filter((video) => {
      const { width, height } = video.video_files[0];
      const aspectRatio = height / width;

      switch (format) {
        case "Landscape":
          return aspectRatio < 1; // Landscape: width > height
        case "Portrait":
          return aspectRatio > 1; // Portrait: height > width
        case "Square":
          return aspectRatio === 1; // Square: height == width
        default:
          return true; // Show all videos if no specific format is selected
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
        {type === "videos" && (
          <select
            value={videoFormat}
            onChange={handleFormatChange}
            className="filter-select"
          >
            <option value="All">All</option>
            <option value="Landscape">Landscape</option>
            <option value="Portrait">Portrait</option>
            <option value="Square">Square</option>
          </select>
        )}
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
