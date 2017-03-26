'use strict';
const h = require('../helpers');
const passport = require('passport');
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

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

  db.userModel.findOne({username}, (err, hasAccount) => {
    if (err) {
      res.send(err);
    } else {
      if (hasAccount) {
        res.send("Have currently account");
      } else {
        db.userModel.create({username, password}, (err, account) => {
          var token = jwt.sign({username: account.username}, 'supersecret', {expiresIn: 10000});
          var userInfo = {
            username: account.username,
            token: token
          }
          res.json(userInfo);
        });
      }
    }
  });
});

router.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  db.userModel.findOne({username, password}, (err, hasAccount) => {
    if (err) {
      res.send(err);
    } else {
      if (hasAccount) {
        var token = jwt.sign({username}, 'supersecret', {expiresIn: 10000});
        var userInfo = {
          username: username,
          token: token
        }
        res.json(userInfo);
      } else {
        res.send("Username or password don't match!");
      }
    }
  });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.send("Logout successfully!");
});

module.exports = router;
