const userModel = require('../models/user');

module.exports = {
  updateAvatar: (userId, avatarUrl) =>
    userModel.updateAvatar(userId, avatarUrl),

  getGroupRequests: userId =>
    userModel.getGroupRequestsByUserId(userId)
      .then((data) => {
        return {
          user_id: data._id,
          group_requests: data.group_requests,
        };
      }),
};
