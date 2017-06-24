const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: String,
  created_date: Number,
  type: String,
  start_time: Number,
  start_address: String,
  start_latlng: {
    lat: Number,
    lng: Number,
  },
  start_radius: Number,
  arriving_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  end_time: Number,
  end_address: String,
  end_latlng: {
    lat: Number,
    lng: Number,
  },
  end_radius: Number,
  destination_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  stopovers: [
    {
      latlng: {
        lat: Number,
        lng: Number,
      },
      radius: Number,
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Group', groupSchema);
