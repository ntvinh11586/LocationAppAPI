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
      groupRepository.create({
        name: groupName,
        created_date: (new Date()).getTime() },
        (err, newGroup) => {
          userRepository.findById(userId, (err, user) => {
            newGroup.users.push(user);
            newGroup.save();
            callback(null, newGroup);
          });
        });
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

function updateEndingPoint(groupId, endTime, endLatlng, callback) {
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
      group.end_time = endTime;
      group.end_latlng = endLatlng;
      group.save();

      callback(null, {
        group_id: group._id,
        name: group.name,
        end_time: group.end_time,
        end_latlng: group.end_latlng,
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

function getEndingPoint(groupId, callback) {
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
    } else if (group.end_latlng.lat !== undefined) {
      callback(null, {
        group_id: group._id,
        name: group.name,
        start_time: group.end_time,
        start_latlng: group.end_latlng,
      });
    } else {
      callback(null, {
        group_id: group._id,
        name: group.name,
        start_time: group.end_time,
      });
    }
  });
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
        });
      });
    }
  });
}

function getArrivingUsers(groupId, callback) {
  groupRepository.findById(groupId)
    .populate({ path: 'arriving_users', model: 'User', select: 'username' })
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
    .populate({ path: 'destination_users', model: 'User', select: 'username' })
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
    .populate({ path: 'arriving_users', model: 'User', select: 'username' })
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
        });
      });
    }
  });
}

function deleteStartingPoint(groupId, callback) {
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
      group.arriving_users = undefined;
      group.save();
      callback(null, {
        group_id: groupId,
      });
    }
  });
}

function deleteEndingPoint(groupId, callback) {
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
      group.end_latlng = undefined;
      group.destination_users = undefined;
      group.save();
      callback(null, {
        group_id: groupId,
      });
    }
  });
}

const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index),
];

function addStopover(groupId, latlng, position, callback) {
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
      const stopover = {
        latlng,
      };
      group.stopovers = insert(group.stopovers, position, stopover);
      group.save();
      callback(null, {
        stopover_id: group.stopovers.slice(-1 - position)[0]._id,
        group_id: groupId,
        latlng,
        position,
      });
    }
  });
}

function deleteStopover(groupId, stopoverId, callback) {
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
      group.stopovers.pull(stopoverId);
      group.save();
      callback(null, {
        stopover_id: stopoverId,
        group_id: groupId,
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
          stopover_id: stopoverId,
          stopover_position: stopoverIndex,
        });
      });
    }
  });
}

function getStopovers(groupId, callback) {
  groupRepository.findById(groupId)
    .populate({ path: 'stopovers.users', model: 'User', select: 'username' })
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
          stopovers: group.stopovers,
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
          stopover_position: stopoverIndex,
          stopover_id: stopoverId,
        });
      });
    }
  });
}

function addRoute(groupId, startLatlng, endLatlng, stopovers, callback) {
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
      group.end_latlng = endLatlng;
      group.stopovers = stopovers;
      group.save();

      callback(null, {
        group_id: groupId,
        start_latlng: startLatlng,
        end_latlng: endLatlng,
        stopovers,
      });
    }
  });
}

function getRoute(groupId, callback) {
  groupRepository.findById(groupId)
    .populate({ path: 'arriving_users', model: 'User', select: 'username' })
    .populate({ path: 'destination_users', model: 'User', select: 'username' })
    .populate({ path: 'stopovers.users', model: 'User', select: 'username' })
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
          end_latlng: group.end_latlng,
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
      group.users.forEach((user) => {
        user.devices.forEach((device) => {
          tokens.push(device.token || null);
        });
      });
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
      .populate({ path: 'users', model: 'User', select: 'username' })
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
      .populate({ path: 'users', model: 'User', select: 'username' })
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

module.exports = {
  createGroup,
  addFriendIntoGroup,
  setTripPlan,
  updateTripPlan,
  deleteTripPlan,
  createPersonalChat,
  getPersonalChat,
  updateStartingPoint,
  getStartingPoint,
  getEndingPoint,
  addArrivingUser,
  getArrivingUsers,
  deleteArrivingUser,
  addDestinationUser,
  updateEndingPoint,
  getDestinationUsers,
  deleteDestinationUser,
  deleteStartingPoint,
  deleteEndingPoint,
  addStopover,
  deleteStopover,
  addUserIntoStopover,
  getStopovers,
  deleteUserIntoStopover,
  addRoute,
  getRoute,
  deleteRoute,
  getUserFCMTokenSameGroup,

  getGroup: requestData =>
    composeReadGroupsQuery(requestData, 'name start_time end_time users')
      .then(data => readGroupById(data)),

  getGroupIds: requestData =>
    composeReadGroupsQuery(requestData, '_id')
      .then(data => readGroups(data))
      .then(data => composeReadGroupIdsDataResponse(data)),
};
