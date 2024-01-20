const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi();

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  // Add your authentication logic here
  // For example, check if the user has a valid access token
  // Redirect to the login page if not authenticated
  // This is a simplified example, and you may need to implement a more robust authentication mechanism
  if (!req.query.accessToken) {
    return res.redirect('/login'); // Redirect to the login page
  }
  next();
};

// Route for handling song searches
router.get('/search', isAuthenticated, async (req, res) => {
  const { query } = req.query;

  try {
    // Use the Spotify API to search for tracks
    const response = await spotifyApi.searchTracks(query);

    // Extract relevant information from the response
    const tracks = response.body.tracks.items.map((item) => ({
      id: item.id,
      name: item.name,
      artists: item.artists.map((artist) => artist.name).join(', '),
    }));

    // Send the search results to the client
    res.json({ tracks });
  } catch (error) {
    console.error('Error searching'); // Fix: Added closing quotation mark
  }
});
