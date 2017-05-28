const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar_url: String,
  latlng: {
    lng: Number,
    lat: Number,
  },
  devices: [
    {
      token: String,
      date: Number,
    },
  ],
  friend_requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friend_pendings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
