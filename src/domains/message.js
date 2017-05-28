const messageModel = require('../models/message');

module.exports = {
  addMessage: (data) => {
    const { group_id: groupId, user_id: userId, content, type } = data;
    return messageModel.addMessage(groupId, userId, content, type);
  },

  getMessages: (data) => {
    console.log(data);
    const { group_id: groupId, user_id: userId } = data;
    return messageModel.getMessages(groupId, userId);
  },
};
