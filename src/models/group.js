const userRepository = require('../repositories/user');
const groupRepository = require('../repositories/group');

function createGroup(userId, groupName, callback) {
  groupRepository.findOne({ name: groupName }, (err, group) => {
    if (group != null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Already have groups',
      });
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
  groupRepository.find({ users: userId })
    .populate({ path: 'chats.chatter', model: 'User', select: 'username' })
    .populate({ path: 'users', model: 'User', select: 'username' })
    .exec((err, groups) => {
      if (groups == null) {
        callback(new Error('422'), {
          status_code: 422,
          success: false,
          status_message: 'Group not found.',
        });
      } else {
        groups.map((group) => {
          group.markers = undefined;
          group.chats = group.chats.slice(-1);
        });
        callback(null, { groups });
      }
    });
}

function getUserOwnGroup(groupId, callback) {
  groupRepository
    .findOne({ _id: groupId })
    .populate({ path: 'chats.chatter', model: 'User', select: 'username' })
    .populate({ path: 'users', model: 'User', select: 'username' })
    .exec((err, group) => {
      if (group == null) {
        callback(new Error('422'), {
          status_code: 422,
          success: false,
          status_message: 'Group not found.',
        });
      } else {
        group.markers = undefined;
        callback(null, group);
      }
    });
}

function addFriendIntoGroup(groupId, userId, friendId, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (group == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Group not found.',
      });
    } else if (group.users.some(x => x.equals(friendId))) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Already have this friend.',
      });
    } else {
      group.users.push(friendId);
      group.save();

      callback(null, {
        status_code: 200,
        success: true,
        status_message: 'Add friend successfully.',
      });
    }
  });
}

function setTripPlan(groupId, startTime, endTime, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (group == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Group not found.',
      });
    } else {
      group.start_time = startTime;
      group.end_time = endTime;
      group.save();

      callback(null, {
        group_id: group._id,
        name: group.name,
        start_time: group.start_time,
        end_time: group.end_time,
      });
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
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (group != null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Group already exists.',
      });
    } else {
      groupRepository.create({ name: `${userId}${friendId}` }, (err, newGroup) => {
        if (err) {
          callback(err, {
            status_code: 422,
            success: false,
            status_message: err.message,
          });
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
  groupRepository
    .findOne({ users: [userId, friendId] })
    .populate({ path: 'chats.chatter', model: 'User', select: 'username' })
    .populate({ path: 'users', model: 'User', select: 'username' })
    .exec((err, group) => {
      if (err) {
        callback(err, {
          status_code: 422,
          success: false,
          status_message: err.message,
        });
      } if (group == null) {
        callback(new Error('422'), {
          status_code: 422,
          success: false,
          status_message: 'Group not found.',
        });
      } else {
        group.markers = undefined;
        callback(null, group);
      }
    });
}

function updateStartingPoint(groupId, startTime, startLatlng, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } if (group == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Group not found.',
      });
    } else {
      group.start_time = startTime;
      group.start_latlng = startLatlng;
      group.save();

      callback(null, {
        group_id: group._id,
        name: group.name,
        start_time: group.start_time,
        start_latlng: group.start_latlng,
      });
    }
  });
}

function getStartingPoint(groupId, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } if (group == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Group not found.',
      });
    } else if (group.start_latlng.lat !== undefined) {
      callback(null, {
        group_id: group._id,
        name: group.name,
        start_time: group.start_time,
        start_latlng: group.start_latlng,
      });
    } else {
      callback(null, {
        group_id: group._id,
        name: group.name,
        start_time: group.start_time,
      });
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
  updateStartingPoint,
  getStartingPoint,
};
