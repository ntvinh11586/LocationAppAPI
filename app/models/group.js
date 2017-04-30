const db = require('../db');

function createGroup(userId, groupName, callback) {
  db.GroupModel.findOne({ name: groupName }, (err, group) => {
    if (group != null) {
      callback(null, { err: 'Already have group' });
    } else {
      db.GroupModel.create({ name: groupName }, (err, newGroup) => {
        db.UserModel.findById(userId, (err, user) => {
          newGroup.users.push(user);
          newGroup.save();
          callback(null, newGroup);
        });
      });
    }
  });
}

function getUserOwnGroups(userId, callback) {
  db.GroupModel.find({ users: userId }, (err, group) => {
    if (group == null) {
      callback(null, { err: 'Cannot find any groups' });
    } else {
      callback(null, group);
    }
  });
}

function addFriendIntoGroup(userId, friendId, callback) {
  db.GroupModel.findOne({ users: userId }, (err, group) => {
    db.UserModel.findOne({ _id: friendId }, (err, friendUser) => {
      group.users.push(friendUser);
      group.save();
      callback(null, group);
    });
  });
}

function getUserOwnGroup(groupId, callback) {
  db.GroupModel.findOne({ _id: groupId }, (err, group) => {
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
