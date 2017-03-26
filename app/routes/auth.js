'use strict';
const h = require('../helpers');
const passport = require('passport');
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

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
        console.log(hasAccount);
        var _id = hasAccount._id;
        var token = jwt.sign({_id}, 'supersecret', {expiresIn: 10000});
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
