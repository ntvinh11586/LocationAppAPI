const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  date: Number,
  type: String,
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  chatter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Message', messageSchema);
