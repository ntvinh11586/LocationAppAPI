const groupRepository = require('../repositories/group');

function addMarker(groupId, userId, lat, lng, callback) {
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
      const marker = { lat, lng, user: userId };
      group.markers.push(marker);
      group.save();
      callback(null, marker);
    }
  });
}

function getMarkers(groupId, callback) {
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
      const markers = group.markers;
      callback(null, { markers });
    }
  });
}

function deleteMarker(groupId, markerId, callback) {
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
        status_message: 'Account already exists.',
      });
    } else {
      const markers = group.markers;
      if (markers.some(x => x._id.equals(markerId))) {
        group.markers.pull({ _id: markerId });
        group.save();
        callback(null, { marker_id: markerId });
      } else {
        callback(new Error('422'), {
          status_code: 422,
          success: false,
          status_message: 'Marker not found',
        });
      }
    }
  });
}

module.exports = {
  addMarker,
  getMarkers,
  deleteMarker,
};
