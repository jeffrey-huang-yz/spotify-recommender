const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  buttons: [
    {
      buttonId: String,
      maxValue: Number,
      minValue: Number,
      targetValue: Number,
    }
  ],

});

module.exports = {
  User: mongoose.model('User', userSchema),
  // Add other models as needed
};
