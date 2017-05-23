const messageModel = require('../models/message');
const socketioJwt = require('socketio-jwt');

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

function groupMessenger(io) {
  io.of('/chats/groups')
  .on('connection', socketioJwt.authorize({
    secret: 'supersecret',
    timeout: 60000,
  }))
  .on('authenticated', (socket) => {
    if (socket.handshake.query.group_id !== undefined) {
      socket.join(socket.handshake.query.group_id);
    } else {
      socket.emit('error', {
        message_code: 422,
        success: false,
        status_message: 'Group Id not found',
      });
    }

    socket.on('add_message', (chatMessage) => {
      addGroupMessage(chatMessage, (err, data) => {
        socket.emit('add_message_callback', data);
        socket.broadcast
          .to(socket.handshake.query.group_id)
          .emit('add_message_callback', data);
      });
    });

    socket.on('get_messages', (group) => {
      getAllMessagesInGroup(group, (err, data) => {
        socket.emit('get_messages_callback', data);
      });
    });

    socket.on('disconnect', () => {
      const room = socket.handshake.query.group_id;
      socket.leave(room);
    });
  });
}

module.exports = groupMessenger;
