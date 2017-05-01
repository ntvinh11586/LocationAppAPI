const messageModel = require('../models/message');

function addGroupMessage(chatMessage, callback) {
  const chatMessageJSON = JSON.parse(chatMessage);
  const groupId = chatMessageJSON._group_id;
  const chatterId = chatMessageJSON._chatter_id;
  const content = chatMessageJSON.content;
  const date = chatMessageJSON.date;
  messageModel.addMessageIntoGroup(groupId, chatterId, content, date, (err, data) => {
    callback(err, data);
  });
}

function getAllMessagesInGroup(group, callback) {
  const groupJSON = JSON.parse(group);
  const groupId = groupJSON._group_id;
  messageModel.getMessages(groupId, (err, data) => {
    callback(err, data);
  });
}

function groupMessenger(io) {
  io.of('/group_messenger').on('connection', (socket) => {
    socket.on('add_group_message', (chatMessage) => {
      addGroupMessage(chatMessage, (err, data) => {
        socket.emit('add_group_message_callback', data);
        socket.broadcast.emit('add_group_message_callback', data);
      });
    });

    socket.on('get_all_messages_in_group', (group) => {
      getAllMessagesInGroup(group, (err, data) => {
        socket.emit('get_all_messages_in_group_callback', data);
      });
    });
  });
}

module.exports = groupMessenger;
