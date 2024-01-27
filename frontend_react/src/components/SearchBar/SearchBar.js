import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchBar.scss';

<<<<<<< HEAD
const SearchBar = () => {
=======
const SearchBar = ({ onSearch }) => {
>>>>>>> 432bb78fb1a55d7b6486c0813c55fbb4e579d420
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/search/${searchQuery}`);
      onSearch(response.data); // Pass the search results to the parent component
    } catch (error) {
      console.error('Error searching tracks:', error);
      // You can handle the error as needed
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
      />
      <button className='search' onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
