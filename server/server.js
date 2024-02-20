const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const User = require('./src/User');
const app = express();

const cors=require("cors");
app.use(cors({ origin: true, credentials: true }));

const port = process.env.PORT
/*
* MongoDB
*/

const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser'); // Add this line


const { MongoClient } = require('mongodb');

// Connection URI 
const uri = process.env.MONGODB_CONNECT_URI;

// Create a MongoDB client and connect to the database
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// CRUD operations

// Create a new user
app.post('/create-user', async (req, res) => {
  const { email, userId } = req.body;

  try {
    // Create a new user
    const newUser = new User({
      email,
      userId,
    });

    // Save the new user to the database
    await newUser.save();

    // Add default buttons for the new user
    const buttonsData = [
      { buttonId: 'acousticness', maxValue: 1, minValue: 0, userMax: 1, userMin: 0, targetValue: 0.5, userId: newUser._id },
      { buttonId: 'danceability', maxValue: 1, minValue: 0, userMax: 1, userMin: 0, targetValue: 0.5, userId: newUser._id },
      { buttonId: 'energy', maxValue: 1, minValue: 0, userMax: 1, userMin: 0, targetValue: 0.5, userId: newUser._id },
      { buttonId: 'instrumentalness', maxValue: 1, minValue: 0, userMax: 1, userMin: 0, targetValue: 0.5, userId: newUser._id },
      { buttonId: 'key', maxValue: 11, minValue: 0, userMax: 11, userMin: 0, targetValue: 5.5, userId: newUser._id },
      { buttonId: 'liveness', maxValue: 1, minValue: 0, userMax: 1, userMin: 0, targetValue: 0.5, userId: newUser._id },
      { buttonId: 'loudness', maxValue: 1, minValue: 0, userMax: 1, userMin: 0, targetValue: 0.5, userId: newUser._id },
      { buttonId: 'mode', maxValue: 1, minValue: 0, userMax: 1, userMin: 0, targetValue: 0.5, userId: newUser._id },
      { buttonId: 'popularity', maxValue: 100, minValue: 0, userMax: 100, userMin: 0, targetValue: 50, userId: newUser._id },
      { buttonId: 'speechiness', maxValue: 1, minValue: 0, userMax: 1, userMin: 0, targetValue: 0.5, userId: newUser._id },
      { buttonId: 'tempo', maxValue: 250, minValue: 0, userMax: 250, userMin: 0, targetValue: 125, userId: newUser._id },
      { buttonId: 'valence', maxValue: 1, minValue: 0, userMax: 1, userMin: 0, targetValue: 0.5, userId: newUser._id },
    ];

    // Insert default buttons for the new user
    await Buttons.insertMany(buttonsData);

    res.status(200).json({ success: true, message: 'User and buttons created successfully' });
  } catch (error) {
    console.error('Error creating user and buttons:', error);
    res.status(500).json({ success: false, error: 'Error creating user and buttons' });
  }
});

// Read all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Read a specific user by ID
app.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ userId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

app.use(express.json());

// Update a user by ID
app.put('/googleusers/:userId/:buttonId', async (req, res) => {
  const { userId, buttonId } = req.params;
  const { userMin, userMax, targetValue } = req.body;

  try {
    const updatedUser = await User.updateOne(
      { userId: userId, 'buttons.buttonId': buttonId },
      {
        $set: {
          'buttons.$.userMin': userMin,
          'buttons.$.userMax': userMax,
          'buttons.$.targetValue': targetValue,
        },
      },
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete a user by ID
app.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await User.findOneAndDelete({ userId });
    if (deletedUser) {
      res.json(deletedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

app.put('/reset-button-values/:userId', async (req, res) => {
  const {userId} = req.params;

  const originalButtonValues = [
    { buttonId: 'acousticness', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
    { buttonId: 'danceability', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
    { buttonId: 'energy', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
    { buttonId: 'instrumentalness', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
    { buttonId: 'key', max: 11, min: 0, userMax: 11, userMin: 0, targetValue: 5.5 },
    { buttonId: 'liveness', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
    { buttonId: 'loudness', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
    { buttonId: 'mode', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
    { buttonId: 'popularity', max: 100, min: 0, userMax: 100, userMin: 0, targetValue: 50 },
    { buttonId: 'speechiness', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
    { buttonId: 'tempo', max: 250, min: 0, userMax: 250, userMin: 0, targetValue: 125 },
    { buttonId: 'valence', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
  ];

  try {
    const updatedUser = await User.updateOne(
      { userId: userId }, 
      { $set: { buttons: originalButtonValues } },
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});


/*
* Google OAuth
*/

app.use(session({ secret: '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', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: '534940976970-h7dht45d0hn77qust80g79e7aavfplnj.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'https://diskovery.onrender.com/auth/google/callback',
  accessType: 'offline', 
}, async (accessToken, refreshToken, profile, done) => {
  // Check if the user already exists in the database
  try {
    const existingUser = await User.findOne({ userId: profile.id });

    if (existingUser) {
      // User already exists, return the existing user
      return done(null, existingUser);
    }

  
    
      // Add default buttons for the new user
      const buttonsData = [
        { buttonId: 'acousticness', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
        { buttonId: 'danceability', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
        { buttonId: 'energy', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
        { buttonId: 'instrumentalness', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
        { buttonId: 'key', max: 11, min: 0, userMax: 11, userMin: 0, targetValue: 5.5 },
        { buttonId: 'liveness', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
        { buttonId: 'loudness', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
        { buttonId: 'mode', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
        { buttonId: 'popularity', max: 100, min: 0, userMax: 100, userMin: 0, targetValue: 50 },
        { buttonId: 'speechiness', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5 },
        { buttonId: 'tempo', max: 250, min: 0, userMax: 250, userMin: 0, targetValue: 125 },
        { buttonId: 'valence', max: 1, min: 0, userMax: 1, userMin: 0, targetValue: 0.5},
      ];

      // User does not exist, create a new user in the database
      const newUser = new User({
        userId: profile.id,
        email: profile.emails[0].value,
        buttons:  buttonsData,
      });

      await newUser.save();

      return done(null, newUser);
    } catch (error) {
      console.error('Error creating user and buttons:', error);
      return done(error);
    }
  
}));


passport.serializeUser((user, done) => {
  // Serialize user data (save only what you need) into the session
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
'https://www.googleapis.com/auth/userinfo.email'],
accessType: 'offline', approvalPrompt: 'force' }));

  const { OAuth2Client } = require('google-auth-library');
  const google = require('googleapis').google;
  
  const oAuth2Client = new OAuth2Client({
    clientId: '534940976970-h7dht45d0hn77qust80g79e7aavfplnj.apps.googleusercontent.com',
    clientSecret: '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',
    redirectUri: 'https://diskovery.onrender.com/auth/google/callback',
  });
  
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Redirect to your frontend application with user data in query parameters
    res.redirect(`https://diskovery-ljvy.onrender.com/login/?userId=${req.user.userId}&email=${req.user.email}`);
  });
  
  app.get('/googleuser/data', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      // If the user is authenticated, retrieve user data from the database
      const userId = req.user.userId; // Assuming your User model has a field googleId for user identification
  
      try {
        const user = await User.findOne({ userId: userId });
  
        if (user) {
          console.log(user);
          res.json(user);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user' });
      }
    } else {
      // The user is not authenticated, send an error response
      res.status(401).json({ error: 'Not authenticated' });
    }
  });
/**
 * SpotifyWebApi
*/

const spotifyApi = new SpotifyWebApi({
  clientId: 'fb7620c28e204226b196176a4f268215',
  clientSecret: '6b3a14d1ce9241e49805762910f8c0fd',
  redirectUri: 'https://diskovery-ljvy.onrender.com/callback',
});

app.use(cors({
  origin: 'https://diskovery-ljvy.onrender.com', 
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
      'user-modify-playback-state',
      'playlist-modify-public',
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
    res.redirect(`https://diskovery-ljvy.onrender.com/?accessToken=${accessToken}&refreshToken=${refreshToken}`);
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
      return {
        id: item.track.id,
        name: item.track.name,
        uri: item.track.uri,
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

app.get('/playlist-details/:selectedPlaylistId', async (req, res) => {
  const { selectedPlaylistId } = req.params;

  try {
    // Fetch playlist details based on the ID
    const response = await spotifyApi.getPlaylist(selectedPlaylistId);
    const tracks = response.body.tracks.items;
    // Respond with the playlist details
    res.json(tracks);
    console.log(tracks);
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    res.status(500).send('Error fetching playlist details');
  }
});



// Search tracks endpoint
app.get('/search/:query', async (req, res) => {
  const { query } = req.params;
  try {
    const response = await spotifyApi.searchTracks(query);
    const tracks = response.body.tracks.items.map(item => ({
      id: item.id,
      uri:item.uri,
      name: item.name,
      album: {
        albumArt: item.album.images[0].url,
      },
      artist: item.artists.map(artist => artist.name).join(', '),
    }));
    console.log(tracks);
    res.json(tracks);
  } catch (error) {
    console.error('Error searching tracks:', error);
    res.status(500).send('Error searching tracks');
  }
});


// Recommendations endpoint (simplified, adjust based on your needs)
app.get('/recommendations', async (req, res) => {
  const { seedTracks, user } = req.query;
  try {
    const response = await spotifyApi.getRecommendations({ 
      seed_tracks: seedTracks, 
      min_acousticness: user.buttons[0].userMin, max_acousticness: user.buttons[0].userMax, target_acousticness: user.buttons[0].targetValue,
      min_danceability: user.buttons[1].userMin, max_danceability: user.buttons[1].userMax, target_danceability: user.buttons[1].targetValue,
      min_energy: user.buttons[2].userMin, max_energy: user.buttons[2].userMax, target_energy: user.buttons[2].targetValue,
      min_instrumentalness: user.buttons[3].userMin, max_instrumentalness: user.buttons[3].userMax, target_instrumentalness: user.buttons[3].targetValue,
      min_liveness: user.buttons[5].userMin, max_liveness: user.buttons[5].userMax, target_liveness: user.buttons[5].targetValue,
      min_tempo: user.buttons[10].userMin, max_tempo: user.buttons[10].userMax, target_tempo: user.buttons[10].targetValue,
      min_valence: user.buttons[11].userMin, max_valence: user.buttons[11].userMax, target_valence: user.buttons[11].targetValue,
      
    });
    console.log(response.body.tracks);
    const tracks = response.body.tracks.map(item => ({
      name: item.name,
      id: item.id,
      uri:item.uri,
      album: {
        albumArt: item.album.images[0].url,
      },
      artist: item.artists.map(artist => artist.name).join(', '),
    }));
    res.json(tracks);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).send('Error getting recommendations');
  }
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
app.post('/add-tracks-to-playlist', async (req, res) => {
  
  const { playlist_id } = req.body;
  const { uris } = req.body;
  console.log(req.body);
  try {
    // Add tracks to the playlist
    await spotifyApi.addTracksToPlaylist(playlist_id, [uris], { position: 0 });

    res.status(200).send('Track added to playlist successfully');
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    res.status(500).send('Error adding tracks to playlist');
  }
});


// Add Tracks to Playlist
app.get('/user-playlists', async (req, res) => {
  try {
    const response = await spotifyApi.getUserPlaylists();
    const playlists = response.body.items.map(item => ({
      name: item.name,
      id: item.id,
      owner: item.owner,
    }));
    res.json(playlists);
  } catch (error) {
    console.error('Error getting playlists:', error);
    res.status(500).send('Error getting playlists');
  }
});

app.put('/play', async (req, res) => {
  const { trackUri } = req.body;

  try {
    // Start playback for the specified track
    const response = await spotifyApi.play({
      uris: [`${trackUri}`],
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error starting playback:', error);
    res.json({ success: false, error: 'Error starting playback' });
  }
});



app.get('/spotifyuser', async (req, res) => {
  try {
    const response = await spotifyApi.getMe();
    const user = {
      name: response.body.display_name,
      id: response.body.id,
      image: response.body.images.length > 0 ? response.body.images[0].url : null,
    };
    res.json(user);
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).send('Error getting user data');
  }
});

/*
* Router
*/

// In your Express routes or a dedicated file

const router = express.Router();


router.put('/update-button/:userId/:buttonId', async (req, res) => {
  try {
    const { userId, buttonId } = req.params;
    const { min, max, target } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the button within the user's buttons array
    const button = user.buttons.id(buttonId);

    if (!button) {
      return res.status(404).json({ error: 'Button not found' });
    }

    // Update the button properties
    button.minValue = min;
    button.maxValue = max;
    button.targetValue = target;

    // Save the updated user
    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating button:', error);
    res.status(500).json({ error: 'Error updating button' });
  }
});

module.exports = router;

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});