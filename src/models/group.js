const userRepository = require('../repositories/user');
const groupRepository = require('../repositories/group');

function createGroup({ name, type, createdDate: created_date }) {
  return new Promise((resolve, reject) => {
    groupRepository.create({ name, type, created_date }, (error, group) => {
      if (error) {
        reject(new Error(JSON.stringify({
          status_code: 422,
          success: false,
          status_message: error.message,
        })));
      } else {
        resolve(group);
      }
    });
  });
}

function updateUser(data) {
  return new Promise((reslove, reject) => {
    // userId is new,
    groupRepository.findByIdAndUpdate(data.groupId,
      { $push: { users: data.userId || data.friendId } },
      { new: true })
      .select('name type created_date users')
      .populate({ path: 'users', model: 'User', select: 'username fullname avatar_url' })
      .exec((error, group) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          reslove({
            group_id: group._id,
            name: group.name,
            type: group.type,
            created_date: group.created_date,
            users: group.users,
            // Support legacy fields
            _id: group._id,
          });
        }
      });
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

function addArrivingUser(groupId, userId, callback) {
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
      userRepository.findById(userId, (err, user) => {
        group.arriving_users.push(user);
        group.save();
        callback(null, {
          group_id: groupId,
          name: group.name,
          user_id: userId,
          username: user.username,
          fullname: user.fullname,
        });
      });
    }
  });
}

function addDestinationUser(groupId, userId, callback) {
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
      userRepository.findById(userId, (err, user) => {
        group.destination_users.push(user);
        group.save();
        callback(null, {
          group_id: groupId,
          name: group.name,
          user_id: userId,
          username: user.username,
          fullname: user.fullname,
        });
      });
    }
  });
}

function getArrivingUsers(groupId, callback) {
  groupRepository.findById(groupId)
    .populate({ path: 'arriving_users', model: 'User', select: 'username fullname avatar_url' })
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
        callback(null, {
          group_id: groupId,
          arriving_users: group.arriving_users,
        });
      }
    });
}

function getDestinationUsers(groupId, callback) {
  groupRepository.findById(groupId)
    .populate({ path: 'destination_users', model: 'User', select: 'username fullname avatar_url' })
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
        callback(null, {
          group_id: groupId,
          destination_users: group.destination_users,
        });
      }
    });
}

function deleteArrivingUser(groupId, userId, callback) {
  groupRepository.findById(groupId)
    .populate({ path: 'arriving_users', model: 'User', select: 'username fullname avatar_url' })
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
      } else if (group.arriving_users.some(u => u.equals(userId))) {
        group.arriving_users.pull(userId);
        group.save();

        userRepository.findById(userId, (err, user) => {
          callback(null, {
            group_id: groupId,
            name: group.name,
            user_id: userId,
            username: user.username,
            fullname: user.fullname,
          });
        });
      }
    });
}

function deleteDestinationUser(groupId, userId, callback) {
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
    } else if (group.destination_users.some(u => u.equals(userId))) {
      group.destination_users.pull(userId);
      group.save();
      userRepository.findById(userId, (err, user) => {
        callback(null, {
          group_id: groupId,
          name: group.name,
          user_id: userId,
          username: user.username,
          fullname: user.fullname,
        });
      });
    }
  });
}

function addUserIntoStopover(groupId, userId, stopoverId, callback) {
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
      const stopover = group.stopovers.find(so => so._id.equals(stopoverId));
      const stopoverIndex = group.stopovers.findIndex(so => so._id.equals(stopoverId));
      stopover.users.push(userId);
      group.save();

      userRepository.findById(userId, (err, user) => {
        callback(null, {
          group_id: groupId,
          name: group.name,
          user_id: userId,
          username: user.username,
          fullname: user.fullname,
          stopover_id: stopoverId,
          stopover_position: stopoverIndex,
        });
      });
    }
  });
}

function deleteUserIntoStopover(groupId, userId, stopoverId, callback) {
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
      const stopover = group.stopovers.find(so => so._id.equals(stopoverId));
      const stopoverIndex = group.stopovers.findIndex(so => so._id.equals(stopoverId));
      stopover.users.pull(userId);
      group.save();

      userRepository.findById(userId, (err, user) => {
        callback(null, {
          group_id: groupId,
          name: group.name,
          user_id: userId,
          username: user.username,
          fullname: user.fullname,
          stopover_position: stopoverIndex,
          stopover_id: stopoverId,
        });
      });
    }
  });
}

function addRoute(groupId, startLatlng, endLatlng, startRadius, endRadius, stopovers, callback) {
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
      group.start_latlng = startLatlng;
      group.start_radius = startRadius;
      group.end_latlng = endLatlng;
      group.end_radius = endRadius;
      group.stopovers = stopovers;
      group.save();

      callback(null, {
        group_id: groupId,
        start_latlng: startLatlng,
        start_radius: startRadius,
        end_radius: endRadius,
        end_latlng: endLatlng,
        stopovers,
      });
    }
  });
}

function getRoute(groupId, callback) {
  groupRepository.findById(groupId)
    .populate({ path: 'arriving_users', model: 'User', select: 'username fullname avatar_url' })
    .populate({ path: 'destination_users', model: 'User', select: 'username fullname avatar_url' })
    .populate({ path: 'stopovers.users', model: 'User', select: 'username fullname avatar_url' })
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
        callback(null, {
          group_id: groupId,
          start_latlng: group.start_latlng,
          start_radius: group.start_radius,
          end_latlng: group.end_latlng,
          end_radius: group.end_radius,
          arriving_users: group.arriving_users,
          destination_users: group.destination_users,
          stopovers: group.stopovers,
        });
      }
    });
}

function deleteRoute(groupId, callback) {
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
      group.start_latlng = undefined;
      group.end_latlng = undefined;
      group.arriving_users = [];
      group.destination_users = [];
      group.stopovers = [];
      group.save();

      callback(null, {
        group_id: groupId,
      });
    }
  });
}

function getUserFCMTokenSameGroup(groupId, callback) {
  groupRepository.findById(groupId)
    .select('users -_id')
    .populate({ path: 'users', model: 'User', select: 'devices.token -_id' })
    .exec((err, group) => {
      const tokens = [];
      console.log(groupId);
      console.log(group.users);
      if (group.users.length > 0) {
        group.users.forEach((user) => {
          if (user.devices !== undefined) {
            user.devices.forEach((device) => {
              tokens.push(device.token || null);
            });
          }
        });
      }
      callback(null, { tokens });
    });
}


function composeReadGroupsQuery(data, select) {
  return new Promise((reslove) => {
    reslove({ data, select });
  });
}

function readGroups({ data, select }) {
  return new Promise((reslove, reject) => {
    groupRepository.find({ users: data.userId, groups: data.groupId })
      .select(select)
      .populate({ path: 'users', model: 'User', select: 'username fullname avatar_url' })
      .exec((error, groupIds) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          reslove(groupIds);
        }
      });
  });
}

function readGroupById({ data, select }) {
  return new Promise((resolve, reject) => {
    groupRepository.findById(data.groupId)
      .select(select)
      .populate({ path: 'users', model: 'User', select: 'username fullname avatar_url' })
      .exec((error, groupIds) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve(groupIds);
        }
      });
  });
}

function composeReadGroupIdsDataResponse(groupIds) {
  const ids = [];
  groupIds.forEach((group) => {
    ids.push(group._id);
  });
  return { groups: ids };
}

function pushOneUserIntoGroupByGroupId(groupId, { userId }) {
  return new Promise((resolve, reject) => {
    groupRepository.findByIdAndUpdate(groupId,
      { $push: { users: userId } },
      { new: true })
      .select('')
      .exec((error) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve({
            status_code: 200,
            success: true,
            status_message: 'Add user into group successfully.',
          });
        }
      });
  });
}

function updateAvatar(groupId, { avatarUrl }) {
  return new Promise((resolve, reject) => {
    groupRepository.findByIdAndUpdate(groupId, { avatar_url: avatarUrl })
      .exec((error) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve({
            status_code: 200,
            success: true,
            status_message: 'Update avatar successfully.',
          });
        }
      });
  });
}

function readFriendGroupFromName({ name }) {
  return new Promise((resolve) => {
    groupRepository.findOne({ name }, (error, group) => {
      resolve(group);
    });
  });
}

module.exports = {
  // trip plan
  setTripPlan,
  updateTripPlan,
  deleteTripPlan,
  // starting point
  addArrivingUser,
  getArrivingUsers,
  deleteArrivingUser,
  // destinational user
  addDestinationUser,
  getDestinationUsers,
  deleteDestinationUser,
  // stopovers
  addUserIntoStopover,
  deleteUserIntoStopover,
  // route
  addRoute,
  getRoute,
  deleteRoute,
  // fcm
  getUserFCMTokenSameGroup,

  getGroup: requestData =>
    composeReadGroupsQuery(requestData, 'name users created_date type avatar_url start_time end_time')
      .then(data => readGroupById(data)),

  getGroupIds: requestData =>
    composeReadGroupsQuery(requestData, '_id')
      .then(data => readGroups(data))
      .then(data => composeReadGroupIdsDataResponse(data)),

  createNewGroup: requestData =>
    createGroup(requestData),

  addMember: requestData =>
    updateUser(requestData),

  addAcceptedMember: ({ groupId, userId }) =>
    pushOneUserIntoGroupByGroupId(groupId, { userId }),

  updateAvatar: ({ groupId, avatarUrl }) =>
    updateAvatar(groupId, { avatarUrl }),

  readFriendGroup: ({ name }) =>
    readFriendGroupFromName({ name }),
};
