const db = require('../db');

function createCurrentLatlng(userId, lat, lng, callback) {
  db.UserRepository.findById(userId, (err, user) => {
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
  db.UserRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (user == null) {
      callback(null, { err: 'Cannot find users' });
    } else {
      callback(null, user.latlng);
    }
  });
}

module.exports = {
  createCurrentLatlng,
  getPreviousLatlng,
};
