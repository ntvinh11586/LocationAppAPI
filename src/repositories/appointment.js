const mongoose = require('mongoose');

const appointmentShema = new mongoose.Schema({
  latlng: {
    lat: Number,
    lng: Number,
  },
  address: String,
  start_time: Number,
  end_time: Number,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Appointment', appointmentShema);
