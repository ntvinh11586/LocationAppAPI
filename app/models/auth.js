const jwt = require('jsonwebtoken');
const db = require('../db');

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

module.exports = {
  database1,
  database2,
  database3,
};
