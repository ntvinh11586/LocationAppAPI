const groupModel = require('../models/group');
const userModel = require('../models/user');
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
        // Group Models
        promises.push(groupModel.getGroup({ groupId: data[i] }));
        // Lastest message Models
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
          created_date: data[i].created_date || -1,
          type: data[i].type || 'group',
          users: data[i].users,
          messages: data[i + 1].messages,
          // Support leggacy field
          chats: data[i + 1].messages,
        });
      }
      return { groups };
    })
    .then((data) => {
      data.groups.sort((p1, p2) => p2.created_date - p1.created_date);
      return data;
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
        created_date: data[0].created_date || -1,
        type: data[0].type || 'group',
        users: data[0].users,
        messages: data[1].messages,
        // Support legacy field
        _id: data[0]._id,
        chat: data[1].messages,
      };
      return response;
    }),

  createNewGroup: (name, userId, type = 'group') => {
    const createdDate = (new Date()).getTime();
    return groupModel.createNewGroup({ name, type, createdDate })
      .then((group) => {
        const { _id: groupId } = group;
        return groupModel.addMember({ groupId, userId });
      });
  },

  createNewTwoPersonsGroup: (userId, friendId, type = 'friend') => {
    const createdDate = (new Date()).getTime();
    const name = `${userId}${friendId}`;
    return groupModel.createNewGroup({ name, type, createdDate })
    .then((group) => {
      const { _id: groupId } = group;
      return groupModel.addMember({ groupId, userId });
    })
    .then((group) => {
      const { group_id: groupId } = group;
      return groupModel.addMember({ groupId, friendId });
    });
  },

  addUserIntoGroup: (groupId, userId) =>
    userModel.addGroupRequestByUserId({ userId, groupId }),
};
