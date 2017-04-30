const jwt = require('jsonwebtoken');

const router = express.Router();

function get(callback) {
  callback(null, { name: 'demo', version: '2' });
}

function post(data, callback) {
  callback(null, data);
}

function getUserIdWithAuthorization(token, callback) {
  jwt.verify(token, 'supersecret', (err, decoded) => {
    if (err) {
      callback(null, { err: 'err' });
    } else {
      callback(null, { _id: decoded._id });
    }
  });
}

module.exports = {
  get,
  post,
  getUserIdWithAuthorization,
};
