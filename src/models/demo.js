const jwt = require('jsonwebtoken');

function get(callback) {
  callback(null, {
    status_code: 200,
    status_message: 'demo',
    version: 'v0.6.0',
  });
}

function post(data, callback) {
  callback(null, data);
}

function authorization(token, callback) {
  jwt.verify(token, 'supersecret', (err, decoded) => {
    if (err) {
      callback(err, {
        status_code: 401,
        success: false,
        status_message: 'Invalid authrization.',
      });
    } else {
      callback(null, {
        user_id: decoded.user_id,
        username: decoded.username,
      });
    }
  });
}

module.exports = {
  get,
  post,
  authorization,
};
