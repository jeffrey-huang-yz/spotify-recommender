import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlaylistSelector.scss';

const PlaylistSelector = ({ onSelect }) => {
  const [playlists, setPlaylists] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState('');

  useEffect(() => {
    // Fetch user's playlists from your server or Spotify API
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('https://diskovery.onrender.com/user-playlists', { withCredentials: true });
        const userResponse = await axios.get('https://diskovery.onrender.com/spotifyuser', { withCredentials: true });
        
        const userOwnedPlaylists = response.data.filter((playlist) => {
          return playlist.owner.id === userResponse.data.id;
        });

        setPlaylists(userOwnedPlaylists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };
  
    fetchPlaylists();
  }, []);

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
    setSelectedPlaylistName(playlist.name); // Update selected playlist name
    onSelect(playlist); // Callback to parent component with the selected playlist
    closeMenu();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={`playlist-selector ${isMenuOpen ? 'open' : ''} noselect` }>
      <h3 className='choose-playlist' onClick={toggleMenu}>{selectedPlaylistName || 'Choose Playlist:'}</h3>
      <ul className='playlist-list'>
        {playlists.map((playlist) => (
          <li
            key={playlist.id}
            onClick={() => handlePlaylistSelect(playlist)}
            className={playlist === selectedPlaylist ? 'selected' : ''}
          >
            {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistSelector;
