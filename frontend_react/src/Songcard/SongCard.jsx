import React from 'react';
import './SongCard.scss';
const SongCard = ({ song }) => {

  const handlePlay = () => {
    // Implement play functionality here
    console.log(`Playing: ${song.name} by ${song.artist}`);
  };

  const handleAddToPlaylist = () => {
    // Implement add to playlist functionality here
    console.log(`Adding to Playlist: ${song.name} by ${song.artist}`);
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
        <button className="play-button" onClick={handlePlay}>Play</button>
        <button className="add-button">Add to Playlist</button>
      </div>
    </div>
  );
};

export default SongCard;