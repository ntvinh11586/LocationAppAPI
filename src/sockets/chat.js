const socketioJwt = require('socketio-jwt');
const config = require('../config');
const notificationDomain = require('../domains/notification');
const fcmDomain = require('../domains/fcm');
const messageDomain = require('../domains/message');

function joinChat(socket, groupId) {
  if (groupId === undefined || groupId === null) {
    socket.emit('error', {
      message_code: 422,
      success: true,
      status_message: 'Group Id not found',
    });
  } else {
    socket.join(groupId);
  }

  return socket;
}

function notification(socket, data) {
  notificationDomain.notifyNewMessage(
      socket.handshake.query.group_id,
      (err, dTokens) => {
        fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
          notification: {
            title: data.group.name,
            body: `${data.chatter.username}: ${data.content}`,
          },
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
      joinChat(socket, socket.handshake.query.group_id)
        .on('add_message', (data) => {
          messageDomain.addMessage(JSON.parse(data))
            .then((dataResponse) => {
              socket.emit('add_message_callback', dataResponse);
              socket.broadcast
                .to(socket.handshake.query.group_id)
                .emit('add_message_callback', dataResponse);

              notification(socket, dataResponse);
            })
            .catch((error) => {
              const message = JSON.parse(error.message);
              socket.emit('error', message);
            });
        })
        .on('get_messages', (requestData) => {
          messageDomain.getMessages(JSON.parse(requestData))
            .then((responseData) => {
              socket.emit('get_messages_callback', responseData);
            })
            .catch((error) => {
              const message = JSON.parse(error.message);
              socket.emit('error', message);
            });
        })
        .on('disconnect', () => {
          const room = socket.handshake.query.group_id;
          socket.leave(room);
        });
    });
};
