const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: String,
  start_time: Number,
  start_latlng: {
    lat: Number,
    lng: Number,
  },
  end_time: Number,
  end_latlng: {
    lat: Number,
    lng: Number,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  arriving_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  destination_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  chats: [
    {
      content: String,
      date: Number,
      chatter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  markers: [
    {
      latlng: {
        lat: Number,
        lng: Number,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
});

module.exports = mongoose.model('Group', groupSchema);
