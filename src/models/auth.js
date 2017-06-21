const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepository = require('../repositories/user');

function createUser({ username, password, phone, email, gender, birthday, city }) {
  return new Promise((resolve, reject) => {
    userRepository.create(
      { username, password, phone, email, gender, birthday, city },
      (error, user) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve(user);
        }
      });
  });
}


function generateToken(userId, username) {
  return new Promise((resolve) => {
    const userInfo = { username, user_id: userId };
    const tokenSecretKey = config.tokenSecretKey;
    const expiresIn = { expiresIn: config.tokenExpired };
    const token = jwt.sign(userInfo, tokenSecretKey, expiresIn);
    resolve(token);
  });
}

function login(username, password, callback) {
  userRepository.findOne({ username, password })
    .select('username phone email gender birthday city')
    .exec((err, account) => {
      if (err) {
        callback(err, {
          status_code: 422,
          success: false,
          status_message: err.message,
        });
      } else if (account == null) {
        callback(new Error('401'), {
          status_code: 401,
          success: false,
          status_message: 'Username or password is incorrect.',
        });
      } else {
        const userInfo = {
          username: account.username,
          user_id: account._id,
        };
        const tokenSecretKey = config.tokenSecretKey;
        const expiresIn = {
          expiresIn: config.tokenExpired,
        };
        const token = jwt.sign(userInfo, tokenSecretKey, expiresIn);

        callback(null, {
          user_id: account._id,
          username: account.username,
          user_token: token,
          phone: account.phone,
          email: account.email,
          gender: account.gender,
          birthday: account.birthday,
          city: account.birthday,
        });
      }
    });
}

function logout(callback) {
  callback(null, {
    status_code: 200,
    success: true,
    status_message: 'Logout successfully',
  });
}

module.exports = {
  login,
  logout,

  register: payload => createUser(payload),
  generateToken: (userId, username) => generateToken(userId, username),
};
