const { Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  email: String,
  // Other fields...
});

module.exports = {
  User: mongoose.model('User', userSchema),
  // Add other models as needed
};
