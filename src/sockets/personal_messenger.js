const messageModel = require('../models/message');

function addPersonalMessage(chatMessage, callback) {
  const chatMessageJSON = JSON.parse(chatMessage);
  const groupId = chatMessageJSON.group_id;
  const chatterId = chatMessageJSON.chatter_id;
  const content = chatMessageJSON.content;
  const date = chatMessageJSON.date;
  messageModel.addPersonalMessage(groupId, chatterId, content, date, (err, data) => {
    callback(err, data);
  });
}

function getPersonalMessages(group, callback) {
  const groupJSON = JSON.parse(group);
  const groupId = groupJSON.group_id;
  messageModel.getPersonalMessages(groupId, (err, data) => {
    callback(err, data);
  });
}

function personalMessenger(io) {
  io.of('/chats/personal').on('connection', (socket) => {
    socket.on('add_message', (chatMessage) => {
      addPersonalMessage(chatMessage, (err, data) => {
        socket.emit('add_message_callback', data);
        socket.broadcast.emit('add_message_callback', data);
      });
    });

    socket.on('get_messages', (group) => {
      getPersonalMessages(group, (err, data) => {
        socket.emit('get_messages_callback', data);
      });
    });
  });
}

module.exports = personalMessenger;
