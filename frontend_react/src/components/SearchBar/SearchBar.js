import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SearchBar.scss';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for tracks"
        className='search-bar-input'
      />
      <Link to={`/search/${searchQuery}`}>
        <button className='search'>Search</button>
      </Link>
    </div>
  );
};

export default SearchBar;
