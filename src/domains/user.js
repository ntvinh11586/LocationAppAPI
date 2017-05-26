const userModel = require('../models/user');

module.exports = {
  updateAvatar: (userId, avatarUrl) =>
    userModel.updateAvatar(userId, avatarUrl),
};
