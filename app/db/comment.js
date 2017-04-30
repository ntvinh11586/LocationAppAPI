const Mongoose = require('mongoose');

module.exports = new Mongoose.Schema({
  description: String,
  author: {
    _id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
});
