'use strict';
const passport = require('passport');
const config = require('../config');
const h = require('../helpers');
// const FacebookStrategy = require('passport-facebook').Strategy;
// const TwitterStrategy = require('passport-twitter').Strategy;

module.exports = () => {
  // Serialize and deserialize for Sessions
  // https://github.com/jaredhanson/passport#sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    h.findById(id)
        .then(user => done(null, user))
        .catch(error => console.log('Error when deserialize users'));
  });

  // let authProcessor = (accessToken, refreshToken, profile, done) => {
  //   h.findOne(profile.id)
  //     .then(result => {
  //       if (result) {
  //         done(null, result);
  //       } else {
  //         // Create a new user and return
  //         h.createNewUser(profile)
  //             .then(newChatUser => done(null, newChatUser))
  //             .catch(error => console.log('Error when creating new user'));
  //       }
  //     });
  // }
  //
  // passport.use(new FacebookStrategy(config.fb, authProcessor));
  // passport.use(new TwitterStrategy(config.twitter, authProcessor));
}
