const socketioJwt = require('socketio-jwt');
const config = require('../config');
const notificationDomain = require('../domains/notification');

module.exports = (notificationNamespace) => {
  notificationNamespace
  .on('connection', socketioJwt.authorize({
    secret: config.tokenSecretKey,
    timeout: config.networkTimeout,
  }))
  .on('authenticated', (socket) => {
    socket.on('get_notifications', (body) => {
      const { user_id: userId } = JSON.parse(body);
      setInterval(() => {
        notificationDomain.getNotifications(userId)
          .then((data) => {
            socket.emit('get_notifications_callback', data);
          });
      }, 1000);
    });
  });
};
