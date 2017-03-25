'use strict';
const config = require('../config');
const Mongoose = require('mongoose');

// Fix deprecation warning mpromise
// by using the default promise of Node.js.
// https://github.com/Automattic/mongoose/issues/4291
Mongoose.Promise = global.Promise;
Mongoose.connect(config.dbURI);

// Log an error if the connection fails
Mongoose.connection.on('error', error => {
  console.log("MongoDB Error: ", error);
});

// Create a Schema that defines the structure for storing user data
// const chatUser = new Mongoose.Schema({
//   profileId: String,
//   fullName: String,
//   profilePic: String
// });

const newfeed = new Mongoose.Schema({
  title: String,
  image: String,
  description: String,
  location: String,
  rate: Number,
  comments: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

const comment = new Mongoose.Schema({
  description: String
  // author: {
  //   id: {
  //     type: Mongoose.Schema.Types.ObjectId,
  //     ref: "User"
  //   }
  // }
});

// Turn the schema into a usable model
// let userModel = Mongoose.model('User', chatUser);
let newfeedModel = Mongoose.model('Newfeed', newfeed);
let commentModel = Mongoose.model('Comment', comment);

module.exports = {
  Mongoose,
  // userModel,
  newfeedModel,
  commentModel
}
