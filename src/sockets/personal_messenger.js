const messageModel = require('../models/message');

function addPersonalMessage(chatMessage, callback) {
  const chatMessageJSON = JSON.parse(chatMessage);
  const groupId = chatMessageJSON._group_id;
  const chatterId = chatMessageJSON._chatter_id;
  const content = chatMessageJSON.content;
  const date = chatMessageJSON.date;
  messageModel.addMessageIntoGroup(groupId, chatterId, content, date, (err, data) => {
    callback(err, data);
  });
}

function getPersonalMessages(group, callback) {
  const groupJSON = JSON.parse(group);
  const groupId = groupJSON._group_id;
  messageModel.getPersonalMessages(groupId, (err, data) => {
    callback(err, data);
  });
}

function personalMessenger(io) {
  io.of('/personal_messenger').on('connection', (socket) => {
    socket.on('add_personal_message', (chatMessage) => {
      addPersonalMessage(chatMessage, (err, data) => {
        socket.emit('add_personal_message_callback', data);
        socket.broadcast.emit('add_personal_message_callback', data);
      });
    });

    socket.on('get_personal_messages', (group) => {
      getPersonalMessages(group, (err, data) => {
        socket.emit('get_personal_messages_callback', data);
      });
    });
  });
}

module.exports = personalMessenger;
