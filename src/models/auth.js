const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepository = require('../repositories/user');

function register(username, password, callback) {
  userRepository.findOne({ username }, (err, hasAccount) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (hasAccount) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Account already exists.',
      });
    } else {
      userRepository.create({ username, password }, (err, account) => {
        if (err) {
          callback(err, {
            status_code: 422,
            success: false,
            status_message: err.message,
          });
        } else {
          const userInfo = {
            username: account.username,
            user_id: account._id,
          };
          const tokenSecretKey = config.tokenSecretKey;
          const expiresIn = { expiresIn: config.tokenExpired };
          const token = jwt.sign(userInfo, tokenSecretKey, expiresIn);
          callback(null, {
            user_id: account._id,
            username: account.username,
            user_token: token,
          });
        }
      });
    }
  });
}

function login(username, password, callback) {
  userRepository.findOne({ username, password }, (err, account) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (account == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Username or password is incorrect.',
      });
    } else {
      const userInfo = {
        username: account.username,
        user_id: account._id,
      };
      const tokenSecretKey = config.tokenSecretKey;
      const expiresIn = { expiresIn: config.tokenExpired };
      const token = jwt.sign(userInfo, tokenSecretKey, expiresIn);
      callback(null, {
        user_id: account._id,
        username: account.username,
        user_token: token,
      });
    }
  });
}

function logout(callback) {
  callback(null, {
    status: 'success',
    message: 'Logged Out!',
  });
}

module.exports = {
  register,
  login,
  logout,
};
