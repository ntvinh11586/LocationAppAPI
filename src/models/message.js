const userRepository = require('../repositories/user');
const groupRepository = require('../repositories/group');

function addMessageIntoGroup(groupId, chatterId, content, date, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (group == null) {
      callback(null, { err: 'no group' });
    } else {
      userRepository.findById(chatterId, (err, chatter) => {
        if (err) {
          callback(err, { err: 'err' });
        } else if (chatter == null) {
          callback(null, { err: 'no user' });
        } else {
          const chat = { content, date, chatter: chatterId };
          group.chats.push(chat);
          group.save();
          callback(null, chat);
        }
      });
    }
  });
}

function getMessages(groupId, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (group == null) {
      callback(null, { err: 'no group' });
    } else {
      const chats = group.chats;
      callback(err, chats);
    }
  });
}

function addPersonalMessage(groupId, chatterId, content, date, callback) {
  addMessageIntoGroup(groupId, chatterId, content, date, callback);
}

function getPersonalMessages(groupId, callback) {
  getMessages(groupId, callback);
}

module.exports = {
  addMessageIntoGroup,
  getMessages,
  addPersonalMessage,
  getPersonalMessages,
};
