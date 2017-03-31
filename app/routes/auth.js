const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.UserModel.findOne({ username }, (err, hasAccount) => {
    if (err) {
      res.json({status: 'error', message: err});
    } else {
      if (hasAccount) {
        res.json({status: 'error', message: 'Acount already exists!'});
      } else {
        db.userModel.create({username, password}, (err, account) => {
          var token = jwt.sign({username: account.username}, 'supersecret', {expiresIn: 10000});
          var userInfo = {
            _id: account._id,
            username: account.username,
            token: token
          }
          res.json({status: 'success', message: 'Congratulations! Your account has been successfully created!', userInfo: userInfo});
        });
      }
    }
  });
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.UserModel.findOne({ username, password }, (err, hasAccount) => {
    if (err) {
      res.json({status: 'error', message: err});
    } else {
      if (hasAccount) {
        var _id = hasAccount._id;
        var token = jwt.sign({_id}, 'supersecret', {expiresIn: 10000});
        var userInfo = {
          _id: _id,
          username: username,
          token: token
        }
        res.json({status: 'success', message: "You've successfully logged in!", userInfo: userInfo});
      } else {
        res.json({status: 'error', message: "Username or password is incorrect!"});
      }
    }
  });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.json({status: 'success', message: "Logged Out!"});
});

module.exports = router;
