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
  const recentlyPlayedRef = useRef(null);
  const selectedSongsRef = useRef(null); 
  const recommendationRef = useRef(null);
  const searchbarRef = useRef(null);
  const logoutTimeoutRef = useRef(null); // Ref to store the timeout ID
  const [userImage, setUserImage] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const userResponse = await axios.get('https://diskovery.onrender.com/spotifyuser', { withCredentials: true });
    
      setUserImage(userResponse.data.image);
    };

    fetchData();
  }, [userImage]);


  const scrollToRef = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    // Set a timeout for 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
    logoutTimeoutRef.current = setTimeout(() => {
      window.location.href = 'https://diskovery.onrender.com/login'
      console.log('User has been active for an hour. Redirect to login page.');
    }, 60 * 60 * 1000);

    
    return () => {
      clearTimeout(logoutTimeoutRef.current);
    };
  }, []);


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
      showNotification(`You have removed ${song.name} by ${song.artist}`, 1500);
      console.log('Song removed:', song);
    } else if (!isSelected && !isSongSelected && !isLimitReached) {
      // If the song is not selected, not in the array, and the limit is not reached, add it
      setSelectedSongs((prevSelectedSongs) => [...prevSelectedSongs, song]);
      console.log('Song added:', song);
      showNotification(`You have selected ${song.name} by ${song.artist}`, 1500);
    } else if (!isSelected && !isSongSelected && isLimitReached) {
      showNotification(`You can only select up to 5 songs.`, 1500);
      console.log('Song limit reached. Cannot add more songs.');
      
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
      const response = await axios.get('https://diskovery.onrender.com/googleuser/data', { withCredentials: true });
      setUser(response.data);
      setRefreshUserData(false); // Reset the refresh trigger
    };


    const fetchRecentlyPlayedTracks = async () => {
      try {
        const response = await axios.get('https://diskovery.onrender.com/recently-played', { withCredentials: true });
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
      
      const response = await axios.get('https://diskovery.onrender.com/recommendations',{ withCredentials: true }, {
        params: {
          seedTracks: seedTracks,
          user: user,
        }, 
      });
  
      setRecommendationResults(response.data);
      scrollToRef(recommendationRef)
    } catch (error) {
      console.error('Error fetching recommended tracks:', error);
    }
  };

 


  const handleResetButtonValues = async () => {
    try {
      
      const response = await axios.put(`https://diskovery.onrender.com/reset-button-values/${user.userId}`);
      
      setRefreshUserData(true); // Set the refresh trigger
      showNotification( `You have reset the attribute values`, 1500);
    } catch (error) {
      console.error('Error resetting attribute values:', error);
    }
  };
  return (
    <div className='noselect'>

      <nav className="navbar">
        <ul>
          <li onClick={() => scrollToRef(searchbarRef)}>Search Bar</li>
          <li onClick={() => scrollToRef(selectedSongsRef)}>Selected Songs</li>
          <li onClick={() => scrollToRef(recommendationRef)}>Recommended Tracks</li>
          <li onClick={() => scrollToRef(searchRef)}>Search Results</li>
          <li onClick={() => scrollToRef(recentlyPlayedRef)}>Recently Played Tracks</li>
          
        </ul>
      </nav>

      <div className='user-profile'>
        <img src={userImage} alt='Spotify Icon' className='spotify-icon' />
      </div>
      {/* Discovery Section */}
      <div className="home-title" ref={searchbarRef}>
        <h1 className='noselect'>
          <span className="home-purple noselect">disk</span>overy
        </h1>
      </div>

      <NotificationBox visible={visible} text={text} />

      <div className='searchbar' >
        {/* Include the SearchBar component */}
        <SearchBar onSearch={handleSearch} onSearchPerformed={handleSearchPerformed} />
      </div>
      
      <div className='selected-songs-container' ref={selectedSongsRef}>
       
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
      
      <div className='recommendation-container' >

        <button className="reset-button" onClick={handleResetButtonValues}>
          Reset Attribute Values
        </button>
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
      
      {/* Recommendated Tracks Section */}
      <div className="song-cards-container " ref={recommendationRef}>
        <div className='recently-played'>
          <h2>Recommended Tracks:</h2>

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
          <h2>Search Results:</h2>
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
      <div className="song-cards-container " ref={recentlyPlayedRef}>
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