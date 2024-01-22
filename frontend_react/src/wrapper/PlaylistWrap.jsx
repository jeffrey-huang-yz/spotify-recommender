import React, { useState, useEffect } from 'react';
import axios from 'axios';

const withPlaylistSelection = (WrappedComponent) => {
  return (props) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    useEffect(() => {
      // Fetch user's playlists when the component mounts
      const fetchPlaylists = async () => {
        try {
          const response = await axios.get('http://localhost:3001/user-playlists');
          setPlaylists(response.data.items);
        } catch (error) {
          console.error('Error fetching playlists:', error);
        }
      };

      fetchPlaylists();
    }, []);

    const openModal = () => {
      setModalOpen(true);
    };

    const closeModal = () => {
      setModalOpen(false);
    };

    const handlePlaylistSelect = (playlist) => {
      setSelectedPlaylist(playlist);
      closeModal();
    };

    const modalContent = (
      <div className="playlist-modal">
        <h2>Select Playlist</h2>
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id} onClick={() => handlePlaylistSelect(playlist)}>
              {playlist.name}
            </li>
          ))}
        </ul>
        <button onClick={closeModal}>Cancel</button>
      </div>
    );

    return (
      <div>
        <WrappedComponent {...props} openPlaylistModal={openModal} />
        {isModalOpen && modalContent}
      </div>
    );
  };
};

export default withPlaylistSelection;
