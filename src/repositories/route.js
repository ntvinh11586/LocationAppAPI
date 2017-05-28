const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  start_time: Number,
  start_latlng: {
    lat: Number,
    lng: Number,
  },
  start_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  end_time: Number,
  end_latlng: {
    lat: Number,
    lng: Number,
  },
  end_users: [
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
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Route', routeSchema);
