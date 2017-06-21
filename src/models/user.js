const userRepository = require('../repositories/user');

function getUserInfo(userId, callback) {
  userRepository.findById(userId)
    .populate({ path: 'friends', model: 'User', select: 'username' })
    .populate({ path: 'friend_requests', model: 'User', select: 'username' })
    .populate({ path: 'friend_pendings', model: 'User', select: 'username' })
    .exec((err, user) => {
      if (err) {
        callback(err, {
          status_code: 422,
          success: false,
          status_message: err.message,
        });
      } else {
        callback(null, {
          user_id: user._id,
          username: user.username,
          phone: user.phone,
          email: user.email,
          gender: user.gender,
          birthday: user.birthday,
          city: user.city,
          friends: user.friends,
          friend_pendings: user.friend_pendings,
          friend_requests: user.friend_requests,
        });
      }
    });
}

function addDevice(userId, device) {
  return new Promise((resolve, reject) => {
    userRepository.findByIdAndUpdate(userId, { $push: { devices: device } })
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
            status_message: 'Add device Successfully!',
          });
        }
      });
  });
}

function removeDevice(userId, device) {
  return new Promise((resolve, reject) => {
    userRepository.findByIdAndUpdate(userId, { $pullAll: { devices: [device] } })
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
            status_message: 'Remove device Successfully!',
          });
        }
      });
  });
}

function updateAvatar(userId, avatarUrl) {
  return new Promise((resolve, reject) => {
    userRepository.findByIdAndUpdate(userId, { avatar_url: avatarUrl })
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

function readLatlngByUserId(userId) {
  return new Promise((resolve, reject) => {
    userRepository.findById(userId)
      .select('latlng')
      .exec((error, user) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve(user);
        }
      });
  });
}

function pushOneGroupRequestByUserId(userId, { groupId }) {
  return new Promise((resolve, reject) => {
    userRepository.findByIdAndUpdate(userId,
      { $push: { group_requests: groupId } },
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

module.exports = {
  getUserInfo,
  addDevice,
  removeDevice,
  updateAvatar,

  getUserLatlng: userId =>
    readLatlngByUserId(userId),

  addGroupRequestByUserId: ({ userId, groupId }) =>
    pushOneGroupRequestByUserId(userId, { groupId }),
};
