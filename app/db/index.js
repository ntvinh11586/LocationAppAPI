const config = require('../config');
const Mongoose = require('mongoose');

// Fix deprecation warning mpromise
// by using the default promise of Node.js.
// https://github.com/Automattic/mongoose/issues/4291
Mongoose.Promise = global.Promise;
Mongoose.connect(config.dbURI);

// Log an error if the connection fails
Mongoose.connection.on('error', (error) => {
  console.log('MongoDB Error: ', error);
});

const user = new Mongoose.Schema({
  username: String,
  password: String,
});

const newfeed = new Mongoose.Schema({
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

const comment = new Mongoose.Schema({
  description: String,
  author: {
    _id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
});

const latlng = new Mongoose.Schema({
  latitude: String,
  longitude: String,
  _user_id: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const userModel = Mongoose.model('User', user);
const newfeedModel = Mongoose.model('Newfeed', newfeed);
const commentModel = Mongoose.model('Comment', comment);
const latlngModel = Mongoose.model('Latlng', latlng);

module.exports = {
  Mongoose,
  userModel,
  newfeedModel,
  commentModel,
  latlngModel,
};
