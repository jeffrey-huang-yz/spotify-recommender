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
        {/* Pass selectedPlaylistId as a prop to the wrapped component */}
        <Component selectedPlaylistId={selectedPlaylistId} selectedPlaylistName={selectedPlaylistName}/>

        <div className="copyright">
          <p className="p-text"> @2024 Jeffrey</p>
          <p className="p-text"> All rights reserved</p>
        </div>
      </div>

      {/* Pass handleSelectedPlaylist as a prop to PlaylistSelector */}
      <PlaylistSelector onSelect={handleSelectedPlaylist} />
    </div>
  );
};

export default AppWrap;
