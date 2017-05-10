const userRepository = require('../repositories/user');

function getUserInfo(userId, callback) {
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
        friends: user.friends,
        friend_pendings: user.friends_pending,
        friend_requests: user.friend_requests,
      });
    }
  });
}

module.exports = {
  getUserInfo,
};
