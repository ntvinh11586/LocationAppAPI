const groupModel = require('../models/group');

// groupId -> [userId] -> token -> notify
module.exports = {
  notifyNewMessage: (groupId, callback) => {
    groupModel.getUserFCMTokenSameGroup(groupId, (err, data) => {
      callback(err, data);
    });
  },
};
