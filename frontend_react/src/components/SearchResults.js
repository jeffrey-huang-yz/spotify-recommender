import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://diskovery.onrender.com/search/${query}`, { withCredentials: true });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <h1>Search Results</h1>
      <p>Showing results for: {query}</p>
      <ul>
        {searchResults.map((track, index) => (
          <li key={index}>
            {`${track.name} by ${track.artist}`}
            {/* Add any additional information or actions for each result */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;