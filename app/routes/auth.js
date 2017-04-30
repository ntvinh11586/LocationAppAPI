const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

function database1(username, password, callback) {
  db.UserModel.findOne({ username }, (err, hasAccount) => {
    if (err) {
      callback(err, { status: 'error', message: err });
    } else if (hasAccount) {
      callback(null, { status: 'error', message: 'Acount already exists!' });
    } else {
      db.UserModel.create({ username, password }, (err, account) => {
        const token = jwt.sign({ username: account.username }, 'supersecret', { expiresIn: 10000 });
        const userInfo = { _id: account._id, username: account.username, token };
        callback(null, { status: 'success', message: 'Congratulations! Your account has been successfully created!', userInfo });
      });
    }
  });
}

function database2(username, password, callback) {
  db.UserModel.findOne({ username, password }, (err, hasAccount) => {
    if (err) {
      callback(err, { status: 'error', message: err });
    } else if (hasAccount) {
      const token = jwt.sign({ _id: hasAccount._id }, 'supersecret', { expiresIn: 10000 });
      const userInfo = {
        _id: hasAccount._id,
        username,
        token,
      };
      callback(null, { status: 'success', message: "You've successfully logged in!", userInfo });
    } else {
      callback(null, { status: 'error', message: 'Username or password is incorrect!' });
    }
  });
}

function database3(callback) {
  callback(null, { status: 'success', message: 'Logged Out!' });
}

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  database1(username, password, (err, json) => {
    res.json(json);
  });
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  database2(username, password, (err, json) => {
    res.json(json);
  });
});

router.get('/logout', (req, res) => {
  database3((err, json) => {
    res.json(json);
  });
});

module.exports = router;
