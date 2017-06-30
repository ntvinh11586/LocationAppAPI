const notificationRepository = require('../repositories/notification');

function readNotificationsByUserId(userId) {
  return new Promise((resolve, reject) => {
    notificationRepository.find({ user: userId })
      .select('content date type user')
      .populate({ path: 'user', model: 'User', select: 'username fullname' })
      .exec((error, notifications) => {
        if (error) {
          reject(new Error({
            status_code: 422,
            success: false,
            status_message: error.message,
          }));
        } else {
          resolve(notifications);
        }
      });
  });
}

function createNotification({ content, type, userId, date }) {
  return new Promise((resolve, reject) => {
    notificationRepository.create(
      { content, type, user: userId, date },
      (error) => {
        if (error) {
          reject(new Error({
            status_code: 422,
            success: false,
            status_message: error.message,
          }));
        } else {
          resolve({
            status_code: 200,
            success: true,
            status_message: 'Create notification successfully',
          });
        }
      });
  });
}

module.exports = {
  getNotifications: userId => readNotificationsByUserId(userId),
  addNotification: notification => createNotification(notification),
};
