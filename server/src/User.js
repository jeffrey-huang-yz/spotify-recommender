const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserDetail = new Schema({
    googleId: String,
    email: String,
  buttons: [
    {
      buttonId: String,
      max: Number,
      min: Number,
      userMax: Number,
      userMin: Number,
      targetValue: Number,
    }
  ],
});

async function run() {
  await mongoose.connect('mongodb://localhost:27017');
  mongoose.model('User', UserDetail);

}

run();
module.exports = User = mongoose.model('User', UserDetail)