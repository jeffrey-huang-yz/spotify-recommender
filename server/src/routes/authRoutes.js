const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: 'fb7620c28e204226b196176a4f268215',
  clientSecret: '6b3a14d1ce9241e49805762910f8c0fd',
  redirectUri: 'http://localhost:3001/callback', // This should match the redirect URI set up in your Spotify Developer Dashboard
});

// Redirect the user to the Spotify authentication page
router.get('/login', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(['user-read-private', 'user-read-email'], 'state');
  res.redirect(authorizeURL);
});

// Callback URL after successful authentication
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange the authorization code for an access token
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];


    // Set access token on the API object
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    // Redirect to the front-end with tokens (in a production environment, handle tokens securely)
    res.redirect(`http://localhost:3000/?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  } catch (error) {
    console.error('Error getting access token:', error);
    res.status(500).send('Error getting access token');
  }
});

module.exports = router;
