const userRepository = require('../repositories/user');

function getUserInfo(userId, token, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else {
      callback(null, {
        user_id: user._id,
        username: user.username,
      });
    }
  });
}

module.exports = {
  getUserInfo,
};
