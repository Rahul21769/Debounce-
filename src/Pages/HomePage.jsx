/** @format */

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

  const fetchContent = useCallback(
    async (searchQuery, pageNum) => {
      setLoading(true);
      try {
        let newResults = [];

        if (type === "images") {
          newResults = await searchPhotos(searchQuery, pageNum);
        } else if (type === "videos") {
          const fetchedVideos = await searchVideos(searchQuery, pageNum);

          // Correct filtering logic based on format
          newResults =
            videoFormat !== "All"
              ? fetchedVideos.filter((video) => {
                  const { width, height } = video.video_files[0]; // Access video resolution

                  if (videoFormat === "Landscape") {
                    return width > height; // Landscape videos
                  } else if (videoFormat === "Portrait") {
                    return height > width; // Portrait videos
                  } else if (videoFormat === "Square") {
                    return width === height; // Square videos
                  }
                  return true;
                })
              : fetchedVideos;
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
    [type, videoFormat]
  );

  useEffect(() => {
    setPage(1);
    setResults([]);
    fetchContent(debouncedQuery || DEFAULT_QUERY, 1);
  }, [fetchContent, debouncedQuery, type]);

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
      setVideoFormat("All");
      setPage(1);
      setResults([]);
      fetchContent(debouncedQuery || DEFAULT_QUERY, 1);
    },
    [debouncedQuery, fetchContent]
  );

  const handleFormatChange = (event) => {
    setVideoFormat(event.target.value);
    setPage(1);
    setResults([]);
    fetchContent(debouncedQuery || DEFAULT_QUERY, 1);
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
          <select value={videoFormat} onChange={handleFormatChange} className="filter-select">
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
        {!hasMore && !loading && results.length > 0 && <p>No more results to show.</p>}
        {results.length === 0 && !loading && <p>No results found.</p>}
      </div>
    </div>
  );
};

export default HomePage;
