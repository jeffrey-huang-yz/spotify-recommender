import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.scss';

const SearchBar = ({ onSearch, onSearchPerformed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://diskovery.onrender.com/search/${searchQuery}`);
      onSearch(response.data); // Pass the search results to the parent component
      onSearchPerformed(); // Invoke the callback to notify home.jsx of the search
    } catch (error) {
      console.error('Error searching tracks:', error);
      // You can handle the error as needed
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isInputFocused) {
      handleSearch();
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for tracks"
        className='search-bar-input'
        onKeyDown={handleKeyDown}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
      <button className='search' onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
