import React, { useEffect } from 'react';
import './SongCard.scss';
import axios from 'axios';

const SongCard = ({ song, selectedPlaylistId }) => {
  useEffect(() => {
    // This block will run whenever selectedPlaylist changes
    console.log('Selected playlist changed, re-rendering SongCard:', selectedPlaylistId);
  }, [selectedPlaylistId]);
  const handlePlay = async () => {
    try {
      // Call the /play route on your server with the selectedPlaylistId
      const response = await axios.put('http://localhost:3001/play', {
        trackUri: song.uri
      });

      const data = response.data;
      if (data.success) {
        console.log(`Playing: ${song.name} by ${song.artist}`);
      } else {
        console.error('Error starting playback:', data.error);
      }
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };

  const handleAddToPlaylist = async () => {
    try {
      const response = await axios.post('http://localhost:3001/add-tracks-to-playlist', {
        playlist_id: selectedPlaylistId,
        uris: song.uri
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log(response.data);
    } catch (error) {
      console.error('Error adding tracks to playlist:', error.message);
    }
  };

  return (
    <div className="song-card">
      {/* Use 'albumImage' as the source for the 'img' tag */}
      <img
        alt={song.name}
        className="album-cover"
        src={song.album.albumArt}
        // Adjust the width and height as needed
      />
      <h3>{song.name}</h3>
      <h3>{song.artist}</h3>
      <div className="buttons-container">
        <button className="play-button" onClick={handlePlay}>
          Play
        </button>
        <button className="add-button" onClick={handleAddToPlaylist}>Add to Playlist</button>
      </div>
    </div>
  );
};

export default SongCard;
