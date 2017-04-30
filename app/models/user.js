const userRepository = require('../db/user');

function getUserInfo(userId, token, callback) {
  userRepository.findById(userId, (err, user) => {
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
