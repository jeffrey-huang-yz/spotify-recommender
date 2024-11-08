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
      
      <div id="signals">
        <span class="signal s1"></span>
        <span class="signal s2"></span>
        <span class="signal s3"></span>
        <span class="signal s4"></span>
      </div>
      <h1 className='title'>
        <span className="purple-text">disk</span>overy
      </h1>
      <p>
      Welcome to diskovery! This website helps you discover new music based on your specific preferences. 
      <br></br>Step 2: Log in with your <span className='green-text'> Spotify account</span> to get started so you can add spotify music you find to your playlists.
      </p>
      <a href="https://diskovery.onrender.com/login" className="spotify-button">Log in with Spotify</a>
      


    </div>

  
  
    );
  }
  
  export default Login;