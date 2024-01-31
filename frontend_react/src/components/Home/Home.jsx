import React, { useState, useEffect } from 'react';
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
  const [buttons, setButtons] = useState([]);


  const handleSongCardClick = (songId, isSelected) => {
    // Update the list of selected songs based on the click
    if (isSelected) {
      setSelectedSongs((prevSelectedSongs) =>
        prevSelectedSongs.filter((id) => id !== songId)
      );
    } else {
      setSelectedSongs((prevSelectedSongs) => [...prevSelectedSongs, songId]);
    }
  };

  const handleSearchPerformed = () => {
    showNotification(`Successful search! The results will be found in the search results box.`, 3000);  
  };

  useEffect(() => {
    const fetchRecentlyPlayedTracks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/recently-played');
        setRecentlyPlayedTracks(response.data);
      } catch (error) {
        console.error('Error fetching recently played tracks:', error);
      }

      axios.get('/buttons')
      .then(response => {
        setButtons(response.data);
      })
      .catch(error => {
        console.error('Error fetching buttons:', error);
      });
    };

    fetchRecentlyPlayedTracks();

    window.location.href = 'http://localhost:3001/auth/google';
  }, []);

  const handleSearch = async (searchData) => {
    setSearchResults(searchData);
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

  const [showPopup, setShowPopup] = useState(false);
  const [popupValue, setPopupValue] = useState(50); // Initial value for the pop-up

  const [buttonValues, setButtonValues] = useState({
    button1: 25,
    button2: 50,
    button3: 75,
    // Add more buttons and their default values as needed
  });

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handlePopupValueChange = (value) => {
    setPopupValue(value);
  };

  const handleButtonClick = (buttonName, buttonId) => {
    setPopupValue(buttonValues[buttonName]);
    handlePopupOpen();
  };

  return (
    <div>
      {/* Discovery Section */}
      <div className="home-title">
        <h1>
          <span className="home-purple">disk</span>overy
        </h1>
      </div>
      <NotificationBox visible={visible} text={text} />
      <div className='searchbar'>
        {/* Include the SearchBar component */}
        <SearchBar onSearch={handleSearch} onSearchPerformed={handleSearchPerformed}/>
      </div>
      
      <div>
        {buttons.map((button) => (
          <button
            key={button.buttonId}
            onClick={() => handleButtonClick(button.buttonId)}
          >
            {button.buttonId}
          </button>
        ))}
      </div>

      <div>
        {/* Pill-shaped buttons */}
      
        {/* Pop-up */}
        {showPopup && (
          <Popup onClose={handlePopupClose} onValueChange={handlePopupValueChange} initialValue={popupValue} />
        )}
      </div>

      <div className='song-cards-container'>
        {/* Display search results if available */}
        <div className="search-results">
          <h2>Search Results</h2>
        {searchResults.length > 0 && (
    
            <div className='songcards'>
              {searchResults.map((track, index) => (
                <SongCard key={index} song={track} selectedPlaylistId={selectedPlaylistId} selectedPlaylistName={selectedPlaylistName}/>
              ))}
            </div>
          
        )}
        </div>
      </div>

      {/* Recently Played Tracks Section */}
      <div className="song-cards-container">
        <div className='recently-played'>
          <h2>Recently Played Tracks</h2>

          <div className='songcards'>
          {uniqueRecentlyPlayedTracks.map((track, index) => (
            <SongCard key={index} song={track} selectedPlaylistId={selectedPlaylistId} selectedPlaylistName={selectedPlaylistName}/>
          ))}
        </div>
      </div>
        

    </div>
    </div>
  );
}

export default AppWrap(Home);
