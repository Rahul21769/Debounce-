import React, { useState } from "react";
import "./SearchBar.css"

const SearchBar = ({ onSearch, defaultQuery }) => {
  const [input, setInput] = useState(defaultQuery);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setInput(newQuery);
    onSearch(newQuery); // Trigger the search on input change
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Search for images or videos..."
        className="search-input"
        
      />
    </div>
  );
};

export default SearchBar;
