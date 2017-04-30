const db = require('../db');

function createGroup(userId, groupName, callback) {
  db.GroupRepository.findOne({ name: groupName }, (err, group) => {
    if (group != null) {
      callback(null, { err: 'Already have group' });
    } else {
      db.GroupRepository.create({ name: groupName }, (err, newGroup) => {
        db.UserRepository.findById(userId, (err, user) => {
          newGroup.users.push(user);
          newGroup.save();
          callback(null, newGroup);
        });
      });
    }
  });
}

function getUserOwnGroups(userId, callback) {
  db.GroupRepository.find({ users: userId }, (err, group) => {
    if (group == null) {
      callback(null, { err: 'Cannot find any groups' });
    } else {
      callback(null, group);
    }
  });
}

function addFriendIntoGroup(userId, friendId, callback) {
  db.GroupRepository.findOne({ users: userId }, (err, group) => {
    db.UserRepository.findOne({ _id: friendId }, (err, friendUser) => {
      group.users.push(friendUser);
      group.save();
      callback(null, group);
    });
  });
}

function getUserOwnGroup(groupId, callback) {
  db.GroupRepository.findOne({ _id: groupId }, (err, group) => {
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
}
