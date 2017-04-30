const Mongoose = require('mongoose');

module.exports = new Mongoose.Schema({
  title: String,
  image: String,
  description: String,
  location: String,
  rate: Number,
  comments: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});
