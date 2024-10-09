/** @format */

import React, { useState, useEffect, useCallback } from "react";
import useDebounce from "../Hooks/useDebounce";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = useCallback(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search for media..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "560px",
          fontSize: "16px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease"
        }}
      />
    </div>
  );
};

export default SearchBar;
