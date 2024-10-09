/** @format */

import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../Components/SearchBar";
import ResultsGrid from "../Components/ResultGrid";
import { searchPhotos, searchVideos } from "../Service/api";
import { useInView } from "react-intersection-observer";
import "./HomePage.css";

const DEFAULT_QUERY = "nature"; // Default search query

const HomePage = () => {
  const [results, setResults] = useState([]);
  const [type, setType] = useState("images");
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const fetchContent = useCallback(
    async (searchQuery, pageNum) => {
      setLoading(true);
      try {
        const newResults =
          type === "images"
            ? await searchPhotos(searchQuery, pageNum)
            : await searchVideos(searchQuery, pageNum);

        if (Array.isArray(newResults)) {
          if (newResults.length === 0) {
            setHasMore(false);
          } else {
            setResults((prevResults) =>
              pageNum === 1 ? newResults : [...prevResults, ...newResults]
            );
            setHasMore(true);
          }
        } else {
          console.warn("Unexpected results format:", newResults);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [type]
  );

  useEffect(() => {
    setPage(1);
    fetchContent(query || DEFAULT_QUERY, 1);
  }, [fetchContent, query, type]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchContent(query || DEFAULT_QUERY, page + 1);
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore, loading, fetchContent, query, page]);

  const handleSearch = useCallback((newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setHasMore(true);
  }, []);

  const handleTypeChange = useCallback(
    (newType) => {
      setType(newType);
      setPage(1);
      setResults([]);
      fetchContent(query || DEFAULT_QUERY, 1);
    },
    [query, fetchContent]
  );

  return (
    <div className="homepage-container">
      <div className="content-header">
        <div className="button-group">
          <button
            className={`button ${type === "images" ? "active" : ""}`}
            onClick={() => handleTypeChange("images")}>
            Images
          </button>
          <button
            className={`button ${type === "videos" ? "active" : ""}`}
            onClick={() => handleTypeChange("videos")}>
            Videos
          </button>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} defaultQuery={DEFAULT_QUERY} />

      <ResultsGrid results={results} type={type} />

      <div ref={ref} className="loading-container">
        {loading && <p>Loading more results...</p>}
        {!hasMore && !loading && results.length > 0 && (
          <p>No more results to show.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
