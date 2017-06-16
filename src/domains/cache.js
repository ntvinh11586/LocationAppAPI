const cacheModel = require('../models/cache');
const userModel = require('../models/user');

module.exports = {
  setUserInfoFromDatabase: ({ userId }) =>
    userModel.getUserLatlng(userId)
      .then(data => cacheModel.setUserValue(userId, data)),
};
