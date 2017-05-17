const userRepository = require('../repositories/user');
const groupRepository = require('../repositories/group');

function addMessageIntoGroup(groupId, chatterId, content, date, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (group == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Group not found.',
      });
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
          callback(null, {
            group_id: groupId,
            _id: group.chats.slice(-1)[0]._id,
            content,
            date,
            chatter: {
              _id: chatter._id,
              username: chatter.username,
            },
          });
        }
      });
    }
  });
}

function getMessages(groupId, callback) {
  groupRepository.findById(groupId)
    .populate({ path: 'chats.chatter', model: 'User', select: 'username' })
    .exec((err, group) => {
      if (err) {
        callback(err, {
          status_code: 422,
          success: false,
          status_message: err.message,
        });
      } else if (group == null) {
        callback(new Error('422'), {
          status_code: 422,
          success: false,
          status_message: 'Group not found.',
        });
      } else {
        const chats = group.chats;
        callback(err, {
          group_id: groupId,
          chats,
        });
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
