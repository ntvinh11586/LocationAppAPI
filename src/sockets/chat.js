const socketioJwt = require('socketio-jwt');
const config = require('../config');
const notificationDomain = require('../domains/notification');
const fcmDomain = require('../domains/fcm');
const messageDomain = require('../domains/message');
const userModel = require('../models/user');

function notification(socket, groupId, data) {
  userModel.getUserInfo(data.chatter._id, (error, userData) => {
    notificationDomain.notifyNewMessage(groupId, (err, dTokens) => {
      fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
        notification: {
          title: data.group.name,
          body: `${userData.name || userData.username}: ${data.content}`,
        },
        data: {
          group_id: JSON.stringify(data.group._id),
          user_id: JSON.stringify(data.chatter._id),
          type: 'chats',
        },
      });
    });
  });
}

module.exports = (chatNamespace) => {
  chatNamespace
    .on('connection', socketioJwt.authorize({
      secret: config.tokenSecretKey,
      timeout: config.networkTimeout,
    }))
    .on('authenticated', (socket) => {
      socket.on('add_message', (data) => {
        const { group_id: groupId } = JSON.parse(data);

        messageDomain.addMessage(JSON.parse(data))
          .then((dataResponse) => {
            socket.emit('add_message_callback', dataResponse);
            socket.emit('get_lastest_sent_message_callback', dataResponse);

            socket.join(groupId);
            socket.broadcast.to(groupId).emit('add_message_callback', dataResponse);
            socket.broadcast.to(groupId).emit('get_lastest_sent_message_callback', dataResponse);

            notification(socket, groupId, dataResponse);
          })
          .catch((error) => {
            const message = JSON.parse(error.message);
            socket.emit('error', message);
          });
      });

      socket.on('get_messages', (requestData) => {
        messageDomain.getMessages(JSON.parse(requestData))
          .then((responseData) => {
            socket.emit('get_messages_callback', responseData);
          })
          .catch((error) => {
            const message = JSON.parse(error.message);
            socket.emit('error', message);
          });
      });

      socket.on('disconnect', () => {
        // TODO Should handle anything in disconnect
        // socket.leave(room);
        console.log('disconnect');
      });
    });
};
