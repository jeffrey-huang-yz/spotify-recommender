// SearchBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for tracks"
      />
      <Link to={`/search/${searchQuery}`}>
        <button>Search</button>
      </Link>
    </div>
  );
};

export default SearchBar;
