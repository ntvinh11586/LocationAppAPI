const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  chats: [
    {
      content: String,
      date: String,
      chatter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  markers: [
    {
      lat: Number,
      lng: Number,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
});

module.exports = mongoose.model('Group', groupSchema);
