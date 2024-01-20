import React from 'react';
import './SongCard.scss';
const SongCard = ({ song }) => {
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
      <p>{song.artist}</p>
      <div className="buttons-container">
        <button className="play-button">Play</button>
        <button className="add-button">Add to Playlist</button>
      </div>
    </div>
  );
};

export default SongCard;