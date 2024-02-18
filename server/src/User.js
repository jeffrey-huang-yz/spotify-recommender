const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserDetail = new Schema({
    userId: String,
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
  await mongoose.connect(process.env.MONGODB_CONNECT_URI);
  mongoose.model('User', UserDetail);

}

run();
module.exports = User = mongoose.model('User', UserDetail)