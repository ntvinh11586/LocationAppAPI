const db = require('../db');

function groupMessenger(io) {
  io.of('/group_messenger').on('connection', (socket) => {
    socket.on('add_group_message', (chatMessage) => {
      const chatMessageJSON = JSON.parse(chatMessage);
      const groupId = chatMessageJSON._group_id;
      const chatterId = chatMessageJSON._chatter_id;
      const content = chatMessageJSON.content;
      const date = chatMessageJSON.date;

      db.GroupRepository.findById(groupId, (err, group) => {
        if (err) {
          console.log('err');
        } else if (group == null) {
          console.log('no group');
        } else {
          db.UserRepository.findById(chatterId, (err, chatter) => {
            if (err) {
              console.log('err');
            } else if (chatter == null) {
              console.log('no user');
            } else {
              const chat = { content, date, chatter: chatterId };
              group.chats.push(chat);
              group.save();
              socket.emit('add_group_message_callback', chat);
              socket.broadcast.emit('add_group_message_callback', chat);
            }
          });
        }
      });
    });

    socket.on('get_all_messages_in_group', (group) => {
      const groupJSON = JSON.parse(group);
      const groupId = groupJSON._group_id;

      db.GroupRepository.findById(groupId, (err, group) => {
        if (err) {
          console.log('err');
        } else if (group == null) {
          console.log('group');
        } else {
          const chats = group.chats;
          socket.emit('get_all_messages_in_group_callback', chats);
        }
      });
    });
  });
}

module.exports = groupMessenger;
