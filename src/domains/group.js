const groupModel = require('../models/group');
const messageModel = require('../models/message');
const messageDomain = require('./message');

module.exports = {
  showMessageList: userId => groupModel.getGroupIds({ userId })
    .then(({ groups }) => {
      const promises = [];
      groups.forEach((group) => {
        promises.push(group);
        promises.push(messageModel.findTheLastestMessage({ groupId: group }));
      });
      return Promise.all(promises);
    })
    .then((data) => {
      const promises = [];
      for (let i = 0; i < data.length; i += 2) {
        promises.push(groupModel.getGroup({ groupId: data[i] }));
        promises.push(data[i + 1]);
      }
      return Promise.all(promises);
    })
    .then((data) => {
      const groups = [];
      for (let i = 0; i < data.length; i += 2) {
        groups.push({
          _id: data[i]._id,
          name: data[i].name,
          start_time: data[i].start_time,
          end_time: data[i].end_time,
          users: data[i].users,
          messages: data[i + 1].messages,
          // Support leggacy field
          chats: data[i + 1].messages,
        });
      }
      return { groups };
    }),

  getGroup: groupId => groupModel.getGroup({ groupId })
    .then((data) => {
      const promises = [];
      promises.push(data);
      promises.push(messageDomain.getMessages({ group_id: data._id }));
      return Promise.all(promises);
    })
    .then((data) => {
      const response = {
        group_id: data[0]._id,
        name: data[0].name,
        start_time: data[0].start_time,
        end_time: data[0].end_time,
        users: data[0].users,
        messages: data[1].messages,
        // Support legacy field
        _id: data[0]._id,
        chat: data[1].messages,
      };
      return response;
    }),

  createNewGroup: (name, type = 'group', userId) =>
    groupModel.createNewGroup({ name, type })
      .then((group) => {
        const { _id: groupId } = group;
        return groupModel.addMember({ groupId, userId });
      }),
};
