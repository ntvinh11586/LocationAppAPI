const messageModel = require('../models/message');
const socketioJwt = require('socketio-jwt');
const config = require('../config');
const notificationDomain = require('../domains/notification');
const fcmDomain = require('../domains/fcm');

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

function addGroupMessage(chatMessage, callback) {
  const chatMessageJSON = JSON.parse(chatMessage);
  const groupId = chatMessageJSON.group_id;
  const chatterId = chatMessageJSON.chatter_id;
  const content = chatMessageJSON.content;
  const date = chatMessageJSON.date;
  messageModel.addMessageIntoGroup(groupId, chatterId, content, date, (err, data) => {
    callback(err, data);
  });
}

function getAllMessagesInGroup(group, callback) {
  const groupJSON = JSON.parse(group);
  const groupId = groupJSON.group_id;
  messageModel.getMessages(groupId, (err, data) => {
    callback(err, data);
  });
}

module.exports = (chatNamespace) => {
  chatNamespace
    .on('connection', socketioJwt.authorize({
      secret: config.tokenSecretKey,
      timeout: config.networkTimeout,
    }))
    .on('authenticated', (socket) => {
    // .on('connection', (socket) => {
      joinChat(socket, socket.handshake.query.group_id)
        .on('add_message', (chatMessage) => {
          addGroupMessage(chatMessage, (err, data) => {
            socket.emit('add_message_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('add_message_callback', data);

            notificationDomain.notifyNewMessage(
              socket.handshake.query.group_id,
              (err, dTokens) => {
                fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                  notification: {
                    title: data.name,
                    body: `${data.chatter.username}: ${data.content}`,
                  },
                });
              });
          });
        })
        .on('get_messages', (requestData) => {
          getAllMessagesInGroup(requestData, (err, responseData) => {
            socket.emit('get_messages_callback', responseData);
          });
        })
        .on('disconnect', () => {
          const room = socket.handshake.query.group_id;
          socket.leave(room);
        });
    });
};
