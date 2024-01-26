import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../SearchBar/SearchBar';
import SongCard from '../../Songcard/SongCard';
import './Home.scss';
import {AppWrap} from '../../wrapper';

function Home({ selectedPlaylistId }) {
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
      <div className="home-title">
        <h1>
          <span className="home-purple">disk</span>overy
        </h1>
      </div>
      
      <div className='searchbar'>
        {/* Include the SearchBar component */}
      <SearchBar onSearch={handleSearch} />

      </div>
      
      {/* Recently Played Tracks Section */}
      <div className="song-cards-container">
        <div className='recent-text'>
          <h2>Recently Played Tracks</h2>
        </div>
        
        <div className='songcards'>
        {uniqueRecentlyPlayedTracks.map((track, index) => (
          <SongCard key={index} song={track} selectedPlaylistId={selectedPlaylistId}/>
        ))}
        </div>
        
      </div>
    </div>
  );
}

export default AppWrap(Home);
