import React, { useEffect } from 'react';
import './SongCard.scss';
import axios from 'axios';
import useNotification from '../Notification/useNotification';
import NotificationBox from '../Notification/NotificationBox';

const SongCard = ({ song, selectedPlaylistId, selectedPlaylistName, onSongSelect, isSelected }) => {
  const { visible, text, showNotification } = useNotification();
  
  useEffect(() => {
    // This block will run whenever selectedPlaylist changes
    console.log('Selected playlist changed, re-rendering SongCard:', selectedPlaylistId);
  }, [selectedPlaylistId]);
  
  const handlePlay = async () => {
    try {
      // Call the /play routewith the selectedPlaylistId
      const response = await axios.put('https://diskovery.onrender.com/play', {
        trackUri: song.uri
      });

      const data = response.data;
      if (data.success) {
        console.log(`Playing: ${song.name} by ${song.artist}`);
        showNotification(`Now playing ${song.name} by ${song.artist}`, 3000);
      } else {
        showNotification(`No active device detected, please play spotify on a device. `, 3000);  
        console.error('Error starting playback:', data.error);  
      }
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };
  const handleAddToPlaylist = async () => {
  try {
    // Check if the song is already in the playlist
    console.log(song);
    const playlistDetailsResponse = await axios.get(`https://diskovery.onrender.com/playlist-details/${selectedPlaylistId}`, { withCredentials: true });
    const playlistTracks = playlistDetailsResponse.data;
    console.log(playlistTracks);
    const isSongInPlaylist = playlistTracks.some(item => item.track.id === song.id);



    if (isSongInPlaylist) {
      showNotification(`This song is already in ${selectedPlaylistName}`, 3000);  
      // Handle the case where the song is already in the playlist
      console.log(`Song ${song.name} is already in the playlist`);
      // You can show a notification or handle it in any way you prefer
    } else {
      
        const response = await axios.post('https://diskovery.onrender.com/add-tracks-to-playlist', {
          playlist_id: selectedPlaylistId,
          uris: song.uri
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        console.log(response.data);
        showNotification(`${song.name} was added to: ${selectedPlaylistName}`, 3000);  
    
    }
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    
  }
};


  const handleContainerClick = async (event) => {
    if (!event.target.classList.contains('play-button') && !event.target.classList.contains('add-button')) {
      
      onSongSelect(song);
      isSelected = true;
    }
  };

  return (
    <div className={'song-card'} onClick={handleContainerClick}>
      {/* Use 'albumImage' as the source for the 'img' tag */}
      <img
        alt={song?.name}
        className="album-cover"
        src={song?.album.albumArt}
        // Adjust the width and height as needed
      />
      <h3>{song?.name}</h3>
      <h3>{song?.artist}</h3>
      <div className="buttons-container" >
        <button className="play-button" onClick={handlePlay}>
          Play
        </button>
        <button className="add-button" onClick={handleAddToPlaylist}>Add to Playlist</button>

      </div>
      <NotificationBox visible={visible} text={text} />
    </div>
  );
};

export default SongCard;
