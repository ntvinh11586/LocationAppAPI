const messageModel = require('../models/message');

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
  io.of('/chats/groups').on('connection', (socket) => {
    socket.on('add_message', (chatMessage) => {
      addGroupMessage(chatMessage, (err, data) => {
        socket.emit('add_message_callback', data);
        socket.broadcast.emit('add_message_callback', data);
      });
    });

    socket.on('get_messages', (group) => {
      getAllMessagesInGroup(group, (err, data) => {
        socket.emit('get_messages_callback', data);
      });
    });
  });
}

module.exports = groupMessenger;
