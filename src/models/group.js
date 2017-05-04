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

function addFriendIntoGroup(groupId, userId, friendId, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (group == null) {
      callback(null, { err: 'no group' });
    } else if (group.users.some(x => x.equals(friendId))) {
      callback(null, { err: 'already have this friend' });
    } else {
      group.users.push(friendId);
      group.save();
      callback(null, { message: 'successfull!' });
    }
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
