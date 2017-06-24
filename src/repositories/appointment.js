const mongoose = require('mongoose');

const appointmentShema = new mongoose.Schema({
  latlng: {
    lat: Number,
    lng: Number,
  },
  radius: Number,
  address: String,
  start_time: Number,
  end_time: Number,
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Appointment', appointmentShema);
