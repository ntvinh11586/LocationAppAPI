const Mongoose = require('mongoose');

module.exports = new Mongoose.Schema({
  username: String,
  password: String,
  latlng: {
    lng: Number,
    lat: Number,
  },
  friend_requests: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friends_pending: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friends: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});
