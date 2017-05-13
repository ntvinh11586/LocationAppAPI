const userRepository = require('../repositories/user');

function createCurrentLatlng(userId, lat, lng, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (user == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Cannot find users',
      });
    } else {
      user.latlng.lng = lng;
      user.latlng.lat = lat;
      user.save();
      callback(null, { latlng: { lat, lng } });
    }
  });
}

function getPreviousLatlng(userId, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (user == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'User not found.',
      });
    } else {
      callback(null, { latlng: user.latlng });
    }
  });
}

function updateLatlng(userId, lat, lng, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (user == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'No use found.',
      });
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
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (user == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'User not found.',
      });
    } else if (user.latlng.lat == null || user.latlng.lng == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'Latlng not found.',
      });
    } else {
      user.latlng = undefined;
      user.save();
      callback(null, {
        status_code: 200,
        success: true,
        status_message: 'Delete ok!',
      });
    }
  });
}

module.exports = {
  createCurrentLatlng,
  getPreviousLatlng,
  updateLatlng,
  deleteLatlng,
};
