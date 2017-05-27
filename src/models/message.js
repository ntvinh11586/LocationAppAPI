const messageRepository = require('../repositories/message');
const groupRepository = require('../repositories/group');

function createMessage(data) {
  return new Promise((resolve, reject) => {
    messageRepository.create(data, (error, message) => {
      if (error) {
        reject(new Error(JSON.stringify({
          status_code: 422,
          success: false,
          status_message: error.message,
        })));
      }
      resolve(message);
    });
  });
}

function readMessage(messageId) {
  return new Promise((resolve, reject) => {
    messageRepository.findById(messageId)
      .populate({ path: 'chatter', model: 'User', select: 'username' })
      .populate({ path: 'group', model: 'Group', select: 'name' })
      .exec((error, message) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        }
        resolve(message);
      });
  });
}

function composeAddMessageRequestData(groupId, userId, content, type) {
  return new Promise((resolve) => {
    resolve({
      group: groupId,
      chatter: userId,
      content,
      type,
      date: (new Date()).getTime(),
    });
  });
}

function composeAddMessageResponseData(message) {
  return {
    _id: message._id,
    group: message.group,
    chatter: message.chatter,
    content: message.content,
    type: message.type,
    date: message.date,
    // Support legacy fields
    group_id: message.group._id,
    name: message.group.name,
  };
}

function getMessages(groupId, callback) {
  groupRepository.findById(groupId)
    .populate({ path: 'chats.chatter', model: 'User', select: 'username' })
    .exec((err, group) => {
      console.log(groupId);
      if (err) {
        console.log('err');
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

module.exports = {
  getMessages,
  addMessage: (groupId, userId, content, type) =>
    composeAddMessageRequestData(groupId, userId, content, type)
    .then(data => createMessage(data))
    .then(data => readMessage(data._id))
    .then(data => composeAddMessageResponseData(data)),
};
