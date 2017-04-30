const db = require('../db');

function getUserInfo(userId, token, callback) {
  db.UserRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, { err: 'err' });
    } else {
      callback(null, { _id: user._id, username: user.username });
    }
  });
}

module.exports = {
  getUserInfo,
};
