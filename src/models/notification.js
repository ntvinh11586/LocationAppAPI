const notificationRepository = require('../repositories/notification');

function readNotificationsByUserId(userId) {
  return new Promise((resolve, reject) => {
    notificationRepository.find({ user: userId })
      .populate({ path: 'user', model: 'User', select: 'username' })
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

function createNotification({ content, type, userId }) {
  console.log('abcdef');
  return new Promise((resolve, reject) => {
    notificationRepository.create(
      { content, type, user: userId },
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
