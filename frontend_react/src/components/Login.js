// Login.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForAccessToken, verifyAccessToken } from '../utility/spotifyApi'; // Update the path

const Login = () => {
  const navigate = useNavigate();

  const handleSpotifyLogin = async () => {
    console.log('Handling Spotify Login...');
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      try {
        console.log('Exchanging code for access token...');
        const accessToken = await exchangeCodeForAccessToken(code);
        const userData = await verifyAccessToken(accessToken);
        console.log('Access token obtained:', accessToken);
        
        // Redirect to the home page after successful login
        if (userData) {
          console.log('User data:', userData);
          console.log('Redirecting to home page...');
          navigate('/');
        }
      } catch (error) {
        console.error('Error handling Spotify login:', error);
        // Display an error message to the user or handle the error appropriately
      }
    }
  };

  useEffect(() => {
    handleSpotifyLogin();
  }, [navigate]);

  return (
    <div>
      <h1>Login with Spotify</h1>
      {/* You can include your login form or authentication logic here */}
      {/* For simplicity, assuming the user will be redirected to Spotify login */}
      <a href="http://localhost:3001/login">Log in with Spotify</a>
    </div>
  );
};

export default Login;
