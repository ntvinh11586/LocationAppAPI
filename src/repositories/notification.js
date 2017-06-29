const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  content: String,
  type: String,
  date: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
