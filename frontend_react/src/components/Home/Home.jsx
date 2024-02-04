import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar/SearchBar';
import SongCard from '../../Songcard/SongCard';
import './Home.scss';
import { AppWrap } from '../../wrapper';
import useNotification from '../../NotificationHome/useNotification';
import NotificationBox from '../../NotificationHome/NotificationBox';
import Popup from '../../Popup/Popup';
function Home({ selectedPlaylistId, selectedPlaylistName, onSearch }) {
  const { visible, text, showNotification } = useNotification();
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const [selectedSongs, setSelectedSongs] = useState([]); // New state for selected songs
  const [user, setUser] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [refreshUserData, setRefreshUserData] = useState(false);
  const [seedTracks, setSeedTracks] = useState('');
  const [recommendationResults, setRecommendationResults] = useState([]); 
  const searchRef = useRef(null);

  const handleSongSelect = (song, isSelected) => {
    // Check if the song is already in the selectedSongs array
    const isSongSelected = selectedSongs.some((selectedSong) => selectedSong.id === song.id);
  
    // Check if the limit of 5 songs is reached
    const isLimitReached = selectedSongs.length >= 5;
  
    if (isSongSelected) {
      // If the song is already selected and in the array, remove it
      setSelectedSongs((prevSelectedSongs) =>
        prevSelectedSongs.filter((selectedSong) => selectedSong.id !== song.id)
      );
      console.log('Song removed:', song);
    } else if (!isSelected && !isSongSelected && !isLimitReached) {
      // If the song is not selected, not in the array, and the limit is not reached, add it
      setSelectedSongs((prevSelectedSongs) => [...prevSelectedSongs, song]);
      console.log('Song added:', song);
    } else if (!isSelected && !isSongSelected && isLimitReached) {
      // Handle the case where the limit is reached
      console.log('Song limit reached. Cannot add more songs.');
      // You can show a notification or handle it in any way you prefer
    }
  };
  
  useEffect(() => {
    // Update seedTracks whenever selectedSongs changes
    const newSeedTracks = selectedSongs.map((song) => song.id).join(',');
    setSeedTracks(newSeedTracks);
  }, [selectedSongs]);

  const handleSearchPerformed = () => {
    showNotification(`Successful search! The results will be found in the search results box.`, 3000);  
  };

  useEffect(() => {
    const fetchUser = async () => {
        const response = await axios.get('http://localhost:3001/googleuser/data', { withCredentials: true })
        setUser(response.data);
        setRefreshUserData(false); // Reset the refresh trigger

    };

    const fetchRecentlyPlayedTracks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/recently-played');
        setRecentlyPlayedTracks(response.data);
      } catch (error) {
        console.error('Error fetching recently played tracks:', error);
      }

    };

    const intervalId = setInterval(() => {
      fetchRecentlyPlayedTracks();
    }, 30000); // 30 seconds

    
    fetchRecentlyPlayedTracks();
    fetchUser();
    
    return () => clearInterval(intervalId);
  }, [refreshUserData]);

  const handleSearch = async (searchData) => {
    setSearchResults(searchData);
    if (searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: 'smooth' });
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


 const handleButtonClick = (buttonId) => {
    // Find the clicked button in the user's buttons array
    const clickedButton = user.buttons.find((button) => button.buttonId === buttonId);
    setSelectedButton(clickedButton);
  };

  const handleClosePopup = () => {
    setSelectedButton(null);
    setRefreshUserData(true); // Set the refresh trigger
  };

  const handleRecommendation = async () => {
    try {
      
      const response = await axios.get('http://localhost:3001/recommendations', {
        params: {
          seedTracks: seedTracks,
          user: user,
        },
      });
  
      setRecommendationResults(response.data);
    } catch (error) {
      console.error('Error fetching recommended tracks:', error);
    }
  };

  return (
    <div className='noselect'>
      {/* Discovery Section */}
      <div className="home-title">
        <h1 className='noselect'>
          <span className="home-purple noselect">disk</span>overy
        </h1>
      </div>

      <NotificationBox visible={visible} text={text} />

      <div className='searchbar'>
        {/* Include the SearchBar component */}
        <SearchBar onSearch={handleSearch} onSearchPerformed={handleSearchPerformed} />
      </div>
      
      <div className='song-cards-container'>
        <h2>Selected Songs</h2>
        <div className='songcards'>
          {selectedSongs.map((selectedSong, index) => (
            <SongCard
              key={index}
              song={selectedSong}
              selectedPlaylistId={selectedPlaylistId}
              selectedPlaylistName={selectedPlaylistName}
              onSongSelect={handleSongSelect}
              isSelected={true}
            />
          ))}
        </div>
      </div> 
        
      <div className='button-container'>
        {user && user.buttons.map((button) => (
          <button
            key={button.buttonId}
            onClick={() => handleButtonClick(button.buttonId)}
            className={'button-item'}
          >
            {button.buttonId}
          </button>
        ))}
      </div>
      
      <div className='reommendation-container'>
        <button className="recommendation-button" onClick={handleRecommendation}>Search for recommended songs</button>
      </div>
      
      <div className='buttoncontainer'>
      {selectedButton && (
        <Popup
          onClose={handleClosePopup}
          min = {selectedButton.min}
          max = {selectedButton.max}
          userMin = {selectedButton.userMin}
          userMax = {selectedButton.userMax}
          buttonId={selectedButton.buttonId}
          targetValue={selectedButton.targetValue}
          id={user.userId}
        />
      )}
      </div>
      
      {/* Recently Played Tracks Section */}
      <div className="song-cards-container ">
        <div className='recently-played'>
          <h2>Recently Played Tracks</h2>

          <div className='songcards'>
          {recommendationResults.map((track, index) => (
            <SongCard
            key={index}
            song={track}
            selectedPlaylistId={selectedPlaylistId}
            selectedPlaylistName={selectedPlaylistName}
            onSongSelect={handleSongSelect}
            isSelected={selectedSongs.some((selectedSong) => selectedSong.id === track.id)}
            />
          ))}
          </div>
        </div>
      </div>

      
      <div className='song-cards-container' ref={searchRef}>
        {/* Display search results if available */}
        <div className="search-results">
          <h2>Search Results</h2>
        {searchResults.length > 0 && (
    
            <div className='songcards'>
              {searchResults.map((track, index) => (
                <SongCard
                key={index}
                song={track}
                selectedPlaylistId={selectedPlaylistId}
                selectedPlaylistName={selectedPlaylistName}
                onSongSelect={handleSongSelect}
                isSelected={selectedSongs.some((selectedSong) => selectedSong.id === track.id)}
              />
              ))}
            </div>
          
        )}
        </div>
      </div>

      {/* Recently Played Tracks Section */}
      <div className="song-cards-container ">
        <div className='recently-played'>
          <h2>Recently Played Tracks</h2>

          <div className='songcards'>
          {uniqueRecentlyPlayedTracks.map((track, index) => (
            <SongCard
            key={index}
            song={track}
            selectedPlaylistId={selectedPlaylistId}
            selectedPlaylistName={selectedPlaylistName}
            onSongSelect={handleSongSelect}
            isSelected={selectedSongs.some((selectedSong) => selectedSong.id === track.id)}
          />
          ))}
        </div>
      </div>
        

    </div>
    </div>
  );
}

export default AppWrap(Home);
