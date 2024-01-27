// AppWrap.js
import React, { useState } from 'react';
import { PlaylistSelector } from '../components/Playlist';

const AppWrap = (Component, idName, classNames) => function HOC() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);

  const handleSelectedPlaylist = (selectedPlaylist) => {
    setSelectedPlaylistId(selectedPlaylist.id);
    setSelectedPlaylistName(selectedPlaylist.name)
  };

  return (
    <div id={idName} className={`app__container ${classNames}`}>
      <div className="app__wrapper app__flex">
<<<<<<< HEAD

        {/* Pass handleSelectedPlaylist as a prop to PlaylistSelector */}
      <PlaylistSelector onSelect={handleSelectedPlaylist} />

      {/* Pass selectedPlaylistId as a prop to the wrapped component */}
      <Component selectedPlaylistId={selectedPlaylistId} />
=======
        {/* Pass selectedPlaylistId as a prop to the wrapped component */}
        <Component selectedPlaylistId={selectedPlaylistId} selectedPlaylistName={selectedPlaylistName}/>
>>>>>>> 432bb78fb1a55d7b6486c0813c55fbb4e579d420

        <div className="copyright">
          <p className="p-text"> @2024 Jeffrey</p>
          <p className="p-text"> All rights reserved</p>
        </div>
      </div>

    
    </div>
  );
};

export default AppWrap;
