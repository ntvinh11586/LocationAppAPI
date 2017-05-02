const userRepository = require('../repositories/user');

function createCurrentLatlng(userId, lat, lng, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (user == null) {
      callback(null, { err: 'Cannot find users' });
    } else {
      user.latlng.lng = lng;
      user.latlng.lat = lat;
      user.save();
      callback(null, { lat, lng });
    }
  });
}

function getPreviousLatlng(userId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (user == null) {
      callback(null, { err: 'Cannot find users' });
    } else {
      callback(null, user.latlng);
    }
  });
}

function updateLatlng(userId, lat, lng, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (user == null) {
      callback(null, { err: 'no user' });
    } else {
      user.latlng.lat = lat;
      user.latlng.lng = lng;
      user.save();
      callback(null, { latlng: { lat, lng } });
    }
  });
}

function deleteLatlng(userId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (user == null) {
      callback(null, { err: 'no user' });
    } else if (user.latlng.lat == null || user.latlng.lng == null) {
      callback(null, { err: 'no latlng' });
    } else {
      user.latlng = undefined;
      user.save();
      callback(null, { messasge: 'delete ok!' });
    }
  });
}

module.exports = {
  createCurrentLatlng,
  getPreviousLatlng,
  updateLatlng,
  deleteLatlng,
};
