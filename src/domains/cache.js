const cacheModel = require('../models/cache');
const userModel = require('../models/user');
const groupModel = require('../models/group');

module.exports = {
  /**
    This case used for loading user into database,
    for example, when user login their account into server.
    Server will get userInfo (_id, latlng) and
    all groups belongs to him/her. All data will
    be set to user cache.
  */
  loadUserInfoFromDatabase: ({ userId }) =>
    userModel.getUserLatlng(userId)
      .then(user => Promise.all([user, groupModel.getGroupIds({ userId })]))
      .then(data => ({
        _id: data[0]._id, // data[0] - userInfo (User)
        latlng: data[0].latlng,
        groups: data[1].groups, // data[1]: groups id (Group)
      }))
      .then(data => cacheModel.setUserValue(userId, data)),

  loadUserInfo: ({ userId }) =>
    cacheModel.getUserValue(userId),

  setUserInfo: ({ userId, latlng }) =>
    cacheModel.setUserValue(userId, { _id: userId, latlng }),

  deleteUserInfo: ({ userId }) =>
    cacheModel.deleteUserValue(userId),
};
