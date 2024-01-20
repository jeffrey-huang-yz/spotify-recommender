const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser'); // Add this line

const app = express();
const port = 3001;

const spotifyApi = new SpotifyWebApi({
  clientId: 'fb7620c28e204226b196176a4f268215',
  clientSecret: '6b3a14d1ce9241e49805762910f8c0fd',
  redirectUri: 'http://localhost:3000/callback',
});

app.use(cors({
  origin: 'http://localhost:3000',  // Replace with your React app's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
}));
app.use(bodyParser.json()); // Add this line to parse JSON request bodies

// Redirect to Spotify for authentication
app.get('/login', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(
    [
      'user-read-private',
      'user-read-email',
      'user-read-recently-played',
      'playlist-read-private',    
      'playlist-modify-private',     
    ]);
  res.redirect(authorizeURL);
});
// Callback URL after successful authentication
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
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

// Handle the POST request to exchange code for access token
app.post('/token', async (req, res) => {
  const { code } = req.body;
  console.log('Received code:', code); // Log the code to the console

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log('Authorization Code Grant Data:', data); // Log the data to the console

    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];

    // Set access token on the API object
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    // Respond with the access token (you might want to handle this more securely)
    res.json({ access_token: accessToken });
  } catch (error) {
    
    
  }
});

app.get('/recently-played', async (req, res) => {
  try {
    const response = await spotifyApi.getMyRecentlyPlayedTracks();
    const tracks = response.body.items.map(item => {
      console.log('item.album:', item.track.album);
      return {
        id: item.track.uri,
        name: item.track.name,
        album: {
          name: item.album && item.album.name,
          // Directly access the first image URL
          albumArt:  item.track.album.images[0].url,
          releaseDate: item.album && item.album.release_date,
          // Add other album properties as needed
        },
        artist: item.track.artists.map(artist => artist.name).join(', '),
      };
    });
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    res.status(500).json({ error: 'Error fetching recently played tracks', details: error.message });
  }
});





// Search tracks endpoint
app.get('/search/:query', async (req, res) => {
  const { query } = req.params;
  try {
    const response = await spotifyApi.searchTracks(query);
    const tracks = response.body.tracks.items.map(item => ({
      id: item.id,
      name: item.name,
      album: item.album,
      artist: item.artists.map(artist => artist.name).join(', '),
    }));
    res.json(tracks);
  } catch (error) {
    console.error('Error searching tracks:', error);
    res.status(500).send('Error searching tracks');
  }
});


// Recommendations endpoint (simplified, adjust based on your needs)
app.get('/recommendations/:trackId', async (req, res) => {
  const { trackId } = req.params;
  try {
    const response = await spotifyApi.getRecommendations({ seed_tracks: [trackId] });
    const tracks = response.body.tracks.map(item => ({
      name: item.name,
      id: item.id,
      album: item.album,
      artist: item.artists.map(artist => artist.name).join(', '),
    }));
    res.json(tracks);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).send('Error getting recommendations');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Create Playlist
app.post('/create-playlist', async (req, res) => {
  const { name } = req.body;

  try {
    // Create a new playlist
    const response = await spotifyApi.createPlaylist(name, { public: false });

    // Return the playlist ID
    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).send('Error creating playlist');
  }
});

// Add Tracks to Playlist
app.post('/add-tracks-to-playlist/:playlistId', async (req, res) => {
  const { playlistId } = req.params;
  const { tracks } = req.body;

  try {
    // Add tracks to the playlist
    await spotifyApi.addTracksToPlaylist(playlistId, tracks);

    res.status(200).send('Tracks added to playlist successfully');
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    res.status(500).send('Error adding tracks to playlist');
  }
});

