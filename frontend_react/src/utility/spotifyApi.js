// spotifyApi.js

import axios from 'axios';

export const exchangeCodeForAccessToken = async (code) => {
  try {
    const response = await axios.post('https://diskovery.onrender.com/token', { code });
    return response.data.access_token;
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    throw new Error('Error exchanging code for access token');
  }
};

export const verifyAccessToken = async (accessToken) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // If the request is successful, the user data will be returned
  } catch (error) {
    console.error('Error verifying access token:', error);
    throw new Error('Error verifying access token');
  }
};
