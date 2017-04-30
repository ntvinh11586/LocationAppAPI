const Mongoose = require('mongoose');

module.exports = new Mongoose.Schema({
  name: String,
  users: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  chats: [
    {
      content: String,
      date: String,
      chatter: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  markers: [
    {
      lat: Number,
      lng: Number,
      user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
});
