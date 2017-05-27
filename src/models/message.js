const messageRepository = require('../repositories/message');

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
    chat_id: message._id,
    group: message.group,
    chatter: message.chatter,
    content: message.content,
    type: message.type,
    date: message.date,
    // Support legacy fields
    _id: message._id,
    group_id: message.group._id,
    name: message.group.name,
  };
}

function composeGetMessagesRequestData(groupId, userId) {
  return new Promise(resolve => resolve({ groupId, userId }));
}

function composeGetMessagesResponseData(messages, options) {
  return {
    group_id: options.groupId,
    messages,
    // Support legacy field
    chats: messages,
  };
}

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

function readMessageById(messageId) {
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

function readMessages(options) {
  return new Promise((resolve, reject) => {
    messageRepository.find({ group: options.groupId, chatter: options.userId })
      .select('chatter content type date')
      .populate({ path: 'chatter', model: 'User', select: 'username' })
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

function composeFindTheLastestMessageQuery(data, select) {
  return new Promise((reslove) => {
    console.log(data);
    reslove({ data, select });
  });
}

function readTheLastestMessage({ data, select }) {
  return new Promise((resolve) => {
    messageRepository.find({ group: data.groupId })
      .select(select)
      .sort({ date: -1 })
      .limit(1)
      .populate({ path: 'chatter', model: 'User', select: 'username' })
      .exec((error, messages) => {
        resolve({ messages });
      });
  });
}

module.exports = {
  getMessages: (groupId, userId) =>
    composeGetMessagesRequestData(groupId, userId)
      .then(data => readMessages(data))
      .then(data => composeGetMessagesResponseData(data, { groupId })),

  addMessage: (groupId, userId, content, type) =>
    composeAddMessageRequestData(groupId, userId, content, type)
      .then(data => createMessage(data))
      .then(({ _id: id }) => readMessageById(id))
      .then(data => composeAddMessageResponseData(data)),

  findTheLastestMessage: requestData =>
    composeFindTheLastestMessageQuery(requestData, 'content date type chatter')
      .then(data => readTheLastestMessage(data)),
};
