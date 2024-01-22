// Callback.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForAccessToken, verifyAccessToken } from '../../utility/spotifyApi'; // Update the path
import './Callback.scss';
const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSpotifyCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        console.log('Handling Spotify Callback...');

        // Make sure this URL matches your server endpoint
        const accessToken = await exchangeCodeForAccessToken(code);
        const userData = await verifyAccessToken(accessToken);
        
        // Handle the obtained access token as needed

        // Redirect to the home page after successful login
        if (userData) {
          console.log('User data:', userData);
          navigate('/Home');
        }
      } catch (error) {
        console.error('Error handling Spotify callback:', error);
        // Display an error message to the user or handle the error appropriately
      }
    };

    handleSpotifyCallback();
  }, [navigate]);

  return (
    <div>
      <h1 className='loading'>Processing Spotify Callback</h1>
    </div>
  );
};

export default Callback;
