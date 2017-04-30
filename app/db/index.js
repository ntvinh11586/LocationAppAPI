const config = require('../config');
const Mongoose = require('mongoose');
const userSchema = require('./user');
const newfeedSchema = require('./newfeed');
const commentSchema = require('./comment');
const groupSchema = require('./group');

// Fix deprecation warning mpromise
// by using the default promise of Node.js.
// https://github.com/Automattic/mongoose/issues/4291
Mongoose.Promise = global.Promise;
Mongoose.connect(config.dbURI);

// Log an error if the connection fails
Mongoose.connection.on('error', (error) => {
  console.log('MongoDB Error: ', error);
});

const UserModel = Mongoose.model('User', userSchema);
const newfeedModel = Mongoose.model('Newfeed', newfeedSchema);
const commentModel = Mongoose.model('Comment', commentSchema);
const GroupModel = Mongoose.model('Group', groupSchema);

module.exports = {
  UserModel,
  newfeedModel,
  commentModel,
  GroupModel,
};
