import React from 'react';

const SongCard = ({ song }) => {
  // Check if 'song' and 'song.album' are defined before accessing 'song.album.images'
  const albumImages = song && song.album && song.album.images ? song.album.images : [];
  const albumImage = albumImages.length > 0 ? albumImages[0].url : ''; // Get the first image URL

  return (
    <div className="song-card">
      {/* Check if 'song' is defined before accessing its properties */}
      {song && (
        <>
          {/* Use 'albumImage' as the source for the 'img' tag */}
          <img src={song.albumArt} alt={song.name} className="album-cover" />
          <h3>{song.name}</h3>
          <p>{song.artist}</p>
          <div className="buttons-container">
            <button className="play-button">Play</button>
            <button className="add-button">Add to Playlist</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SongCard;
