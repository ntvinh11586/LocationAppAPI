const userRepository = require('../repositories/user');
const groupRepository = require('../repositories/group');

function createGroup(userId, groupName, callback) {
  groupRepository.findOne({ name: groupName }, (err, group) => {
    if (group != null) {
      callback(null, { err: 'Already have group' });
    } else {
      groupRepository.create({ name: groupName }, (err, newGroup) => {
        userRepository.findById(userId, (err, user) => {
          newGroup.users.push(user);
          newGroup.save();
          callback(null, newGroup);
        });
      });
    }
  });
}

function getUserOwnGroups(userId, callback) {
  groupRepository.find({ users: userId }, (err, group) => {
    if (group == null) {
      callback(null, { err: 'Cannot find any groups' });
    } else {
      callback(null, group);
    }
  });
}

function addFriendIntoGroup(userId, friendId, callback) {
  groupRepository.findOne({ users: userId }, (err, group) => {
    userRepository.findOne({ _id: friendId }, (err, friendUser) => {
      group.users.push(friendUser);
      group.save();
      callback(null, group);
    });
  });
}

function getUserOwnGroup(groupId, callback) {
  groupRepository.findOne({ _id: groupId }, (err, group) => {
    if (group == null) {
      callback(null, { err: 'err' });
    } else {
      callback(null, group);
    }
  });
}

module.exports = {
  createGroup,
  getUserOwnGroups,
  getUserOwnGroup,
  addFriendIntoGroup,
};
