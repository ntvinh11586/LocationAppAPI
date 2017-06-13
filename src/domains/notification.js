const groupModel = require('../models/group');
const notificationModel = require('../models/notification');

module.exports = {
  // groupId -> [userId] -> token -> notify
  notifyNewMessage: (groupId, callback) => {
    groupModel.getUserFCMTokenSameGroup(groupId, (err, data) => {
      callback(err, data);
    });
  },

  getNotifications: userId =>
    notificationModel.getNotifications(userId)
      .then((data) => {
        return { notifications: data };
      }),

  addNotification: notification =>
    notificationModel.addNotification(notification),
};
