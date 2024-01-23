import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../SearchBar/SearchBar';
import SongCard from '../../Songcard/SongCard';
import './Home.scss';
import PlaylistWrap from '../../wrapper/PlaylistWrap';

function Home() {
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentlyPlayedTracks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/recently-played');
        setRecentlyPlayedTracks(response.data);
      } catch (error) {
        console.error('Error fetching recently played tracks:', error);
      }
    };

    fetchRecentlyPlayedTracks();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/search/${searchQuery}`);
      setRecentlyPlayedTracks(response.data);
      // Redirect to search results page
      navigate(`/search/${searchQuery}`);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
  };

  // Function to filter out duplicate songs based on their ID
  const filterUniqueSongs = (tracks) => {
    const uniqueSongs = [];
    const seenIds = new Set();

    for (const track of tracks) {
      if (!seenIds.has(track.id)) {
        uniqueSongs.push(track);
        seenIds.add(track.id);
      }
    }

    return uniqueSongs;
  };

  // Filter out duplicate songs
  const uniqueRecentlyPlayedTracks = filterUniqueSongs(recentlyPlayedTracks);

  return (
    <div>
      {/* Discovery Section */}
      <div className="discovery-section">
        <h1>Discovery</h1>
      </div>

      {/* Include the SearchBar component */}
      <SearchBar onSearch={handleSearch} />

      {/* Recently Played Tracks Section */}
      <div className="song-cards-container">
        <h2>Recently Played Tracks</h2>
        {uniqueRecentlyPlayedTracks.map((track, index) => (
          <SongCard key={index} song={track} />
        ))}
      </div>
    </div>
  );
}

export default PlaylistWrap(Home);
