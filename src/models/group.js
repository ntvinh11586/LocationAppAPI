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
  groupRepository.find({ users: userId }, (err, groups) => {
    if (groups == null) {
      callback(null, { err: 'Cannot find any groups' });
    } else {
      groups.map((group) => {
        group.markers = undefined;
        group.users = undefined;
        group.chats = group.chats.slice(-1);
      });
      callback(null, { groups });
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

function setTripPlan(groupId, startTime, endTime, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (group == null) {
      callback(null, { err: 'no group' });
    } else {
      group.start_time = startTime;
      group.end_time = endTime;
      group.save();
      callback(null, group);
    }
  });
}

function updateTripPlan(groupId, startTime, endTime, callback) {
  setTripPlan(groupId, startTime, endTime, callback);
}

function deleteTripPlan(groupId, callback) {
  setTripPlan(groupId, undefined, undefined, callback);
}

function createPersonalChat(userId, friendId, callback) {
  groupRepository.findOne({ users: [userId, friendId] }, (err, group) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (group != null) {
      callback(null, { err: 'already have group' });
    } else {
      groupRepository.create({ name: `${userId}${friendId}` }, (err, newGroup) => {
        if (err) {
          callback(err, { err: 'err' });
        } else {
          newGroup.users.push(userId);
          newGroup.users.push(friendId);
          newGroup.save();
          callback(null, newGroup);
        }
      });
    }
  });
}

function getPersonalChat(userId, friendId, callback) {
  groupRepository.findOne({ users: [userId, friendId] }, (err, group) => {
    if (err) {
      callback(err, { err: 'err' });
    } if (group == null) {
      callback(null, { err: 'no group' });
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
  setTripPlan,
  updateTripPlan,
  deleteTripPlan,
  createPersonalChat,
  getPersonalChat,
};
