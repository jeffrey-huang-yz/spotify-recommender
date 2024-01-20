const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi();

// Set access token on the Spotify API client
const setAccessToken = (accessToken) => {
  spotifyApi.setAccessToken(accessToken);
};

// Example function to search for tracks on Spotify
const searchTracks = async (query) => {
  try {
    const response = await spotifyApi.searchTracks(query);
    return response.body.tracks.items;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
};

// Example function to get recommendations based on a track ID
const getRecommendations = async (trackId) => {
  try {
    const response = await spotifyApi.getRecommendations({ seed_tracks: [trackId] });
    return response.body.tracks;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

module.exports = {
  setAccessToken,
  searchTracks,
  getRecommendations,
};
