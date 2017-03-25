'use strict';
const h = require('../helpers');
const passport = require('passport');
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

// router.get('/facebook', passport.authenticate('facebook'));
//
// router.get('/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: '../user',
//   failureRedirect: '/'
// }));
//
// router.get('/twitter', passport.authenticate('twitter'));
//
// router.get('/twitter/callback', passport.authenticate('twitter', {
//   successRedirect: '../user',
//   failureRedirect: '/'
// }));
//
// router.get('/user', h.isAuthenticated, (req, res, next) => {
//     res.setHeader('content-type', 'application/json');
//     res.send(req.user);
// });
router.post('/register', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  // TODO: Need a configuration for this token
  var token = jwt.sign({username}, 'supersecret', {expiresIn: 120});
  var userInfo = {
    username: username,
    token: token
  }
  res.json(userInfo);
});

router.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var token = jwt.sign({username}, 'supersecret', {expiresIn: 10000});
  var userInfo = {
    username: username,
    token: token
  }
  res.json(userInfo);
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.send("Logout successfully!");
});

module.exports = router;
