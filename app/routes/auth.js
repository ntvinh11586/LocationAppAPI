const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.UserModel.findOne({ username }, (err, hasAccount) => {
    if (err) {
      res.json({ status: 'error', message: err });
    } else if (hasAccount) {
        res.json({ status: 'error', message: 'Acount already exists!' });
    } else {
      db.UserModel.create({ username, password }, (err, account) => {
        const token = jwt.sign({ username: account.username }, 'supersecret', { expiresIn: 10000 });
        const userInfo = {
          _id: account._id,
          username: account.username,
          token,
        };
        res.json({ status: 'success', message: 'Congratulations! Your account has been successfully created!', userInfo });
      });
    }
  });
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.UserModel.findOne({ username, password }, (err, hasAccount) => {
    if (err) {
      res.json({ status: 'error', message: err });
    } else if (hasAccount) {
      const token = jwt.sign({ _id: hasAccount._id }, 'supersecret', { expiresIn: 10000 });
      const userInfo = {
        _id: hasAccount._id,
        username,
        token,
      };
      res.json({ status: 'success', message: "You've successfully logged in!", userInfo });
    } else {
      res.json({ status: 'error', message: 'Username or password is incorrect!' });
    }
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({ status: 'success', message: 'Logged Out!' });
});

module.exports = router;
