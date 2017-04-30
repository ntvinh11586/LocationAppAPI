const userRepository = require('../db/user');
const groupRepository = require('../db/group');

function updateUserLatlng(groupId, userId, latlng, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (user == null) {
      callback(null, { err: 'no user' });
    } else {
      user.latlng.lat = latlng.lat;
      user.latlng.lng = latlng.lng;
      user.save();
      callback(null, {
        _group_id: groupId,
        _user_id: userId,
        latlng,
      });
    }
  });
}

function getUsersLatlng(groupId, callback) {
  groupRepository.findById(groupId).populate('users').populate('latlng').exec((err, group) => {
    if (err) {
      callback(null, { err: 'err' });
    } else if (group == null) {
      callback(null, { err: 'no group' });
    } else {
      const users = group.users;
      const locations = [];
      for (let i = 0; i < users.length; i += 1) {
        if (users[i].latlng != null) {
          locations.push({ _id: users[i]._id, latlng: users[i].latlng });
        }
      }
      callback(null, { latlngs: locations });
    }
  });
}

module.exports = {
  updateUserLatlng,
  getUsersLatlng,
};
