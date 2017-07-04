const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepository = require('../repositories/user');
const hashRepository = require('./hash');

function createUser({ username, fullname, password, phone, email, gender, birthday, city }) {
  return new Promise((resolve, reject) => {
    const avatarUrl = 'https://res.cloudinary.com/togoimagestore/image/upload/t_media_lib_thumb/v1499149653/default_avatar_foydbh.png';
    const passwordHash = hashRepository.saltHashPassword(password);
    userRepository.create(
      { username,
        password_hash: passwordHash,
        avatar_url: avatarUrl,
        fullname,
        phone,
        email,
        gender,
        birthday,
        city },
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
  const passwordHash = hashRepository.saltHashPassword(password);
  userRepository.findOne({ username, password_hash: passwordHash })
    .select('username fullname avatar_url phone email gender birthday city')
    .exec((err, account) => {
      if (err) {
        callback(err, {
          status_code: 422,
          success: false,
          status_message: err.message,
        });
      } else if (account == null) {
        // execute for legacy storing password
        userRepository.findOne({ username, password })
          .select('username fullname avatar_url phone email gender birthday city')
          .exec((err, account1) => {
            if (err) {
              callback(err, {
                status_code: 422,
                success: false,
                status_message: err.message,
              });
            } else if (account1 == null) {
              callback(new Error('401'), {
                status_code: 401,
                success: false,
                status_message: 'Username or password is incorrect.',
              });
            } else {
              const userInfo = {
                username: account1.username,
                user_id: account1._id,
              };
              const tokenSecretKey = config.tokenSecretKey;
              const expiresIn = {
                expiresIn: config.tokenExpired,
              };
              const token = jwt.sign(userInfo, tokenSecretKey, expiresIn);

              callback(null, {
                user_id: account1._id,
                username: account1.username,
                fullname: account1.fullname,
                avatar_url: account1.avatar_url,
                user_token: token,
                phone: account1.phone,
                email: account1.email,
                gender: account1.gender,
                birthday: account1.birthday,
                city: account1.city,
              });
            }
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
          fullname: account.fullname,
          avatar_url: account.avatar_url,
          user_token: token,
          phone: account.phone,
          email: account.email,
          gender: account.gender,
          birthday: account.birthday,
          city: account.city,
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

  register: payload =>
    createUser(payload),

  generateToken: (userId, username) =>
    generateToken(userId, username),
};
