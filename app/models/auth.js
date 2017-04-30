const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepository = require('../db/user');

function register(username, password, callback) {
  userRepository.findOne({ username }, (err, hasAccount) => {
    if (err) {
      callback(err, { status: 'error', message: err });
    } else if (hasAccount) {
      callback(null, { status: 'error', message: 'Acount already exists!' });
    } else {
      userRepository.create({ username, password }, (err, account) => {
        const token = jwt.sign(
          { username: account.username, _id: account._id },
          config.tokenSecretKey,
          { expiresIn: config.tokenExpired });

        const userInfo = { _id: account._id, username: account.username, token };

        callback(null, {
          status: 'success',
          message: 'Your account has been created!',
          userInfo,
        });
      });
    }
  });
}

function login(username, password, callback) {
  userRepository.findOne({ username, password }, (err, hasAccount) => {
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

function logout(callback) {
  callback(null, { status: 'success', message: 'Logged Out!' });
}

module.exports = {
  register,
  login,
  logout,
};
