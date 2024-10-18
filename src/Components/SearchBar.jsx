import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch, defaultQuery }) => {
  const [input, setInput] = useState(defaultQuery);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    onSearch(e.target.value); // Call onSearch with updated input value
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(input); // Trigger search on Enter key press
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Capture Enter key press
        placeholder="Search for videos or images..."
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
