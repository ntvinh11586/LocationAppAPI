const mongoose = require('mongoose');

const newfeedSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  location: String,
  rate: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

module.exports = mongoose.model('Newfeed', newfeedSchema);
