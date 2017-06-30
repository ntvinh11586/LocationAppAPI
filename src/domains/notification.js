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
        // -1 for notification without date
        // We need to sort in decreased time
        data.sort((p1, p2) => (p2.date || -1) - (p1.date || -1));
        return data;
      })
      .then(data => ({ notifications: data })),

  addNotification: notification =>
    notificationModel.addNotification(notification),
};
