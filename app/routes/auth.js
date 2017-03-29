const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.userModel.findOne({ username }, (err, hasAccount) => {
    if (err) {
      res.send(err);
    } else {
      if (hasAccount) {
        res.send('Have currently account');
      } else {
        db.userModel.create({ username, password }, (err, account) => {
          const token = jwt.sign({ username: account.username }, 'supersecret', { expiresIn: 10000 });
          const userInfo = {
            _id: account._id,
            username: account.username,
            token,
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
        var _id = hasAccount._id;
        var token = jwt.sign({_id}, 'supersecret', {expiresIn: 10000});
        var userInfo = {
          _id: _id,
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
