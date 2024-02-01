import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForAccessToken, verifyAccessToken } from '../../utility/spotifyApi'; // Update the path
import './Login.scss';
const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    handleSpotifyLogin();
    
  }, [navigate]);

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
          navigate('/Home');
        }
      } catch (error) {
        console.error('Error handling Spotify login:', error);
        // Display an error message to the user or handle the error appropriately
      }
    }
  };

  return (
    <div>
      <h1 className='title'>
        <span className="purple-text">disk</span>overy
      </h1>
      <a href="http://localhost:3001/login" className="spotify-button">Log in with Spotify</a>
      <p>
      Welcome to diskovery! This website helps you discover new music based on your specific preferences. <br></br>Log in with your <span className='green-text'> Spotify account</span> to get started so you can add music to playlists in real time.
      </p>
    </div>
    );
  }
  
  export default Login;