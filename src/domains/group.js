const groupModel = require('../models/group');
const messageModel = require('../models/message');

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
        promises.push(groupModel.getGroups({ groupId: data[i] }));
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
        });
      }
      return { groups };
    }),
};
