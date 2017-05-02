const groupRepository = require('../repositories/group');

function addMarker(groupId, userId, lat, lng, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (group == null) {
      callback(null, { err: 'no group' });
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
      callback(err, { err: 'err' });
    } else if (group == null) {
      callback(null, { err: 'no group' });
    } else {
      const markers = group.markers;
      callback(null, markers);
    }
  });
}

function deleteMarker(groupId, markerId, callback) {
  groupRepository.findById(groupId, (err, group) => {
    if (err) {
      callback(err, { err: 'err' });
    } else if (group == null) {
      callback(null, { err: 'no group' });
    } else {
      const markers = group.markers;
      if (markers.some(x => x._id.equals(markerId))) {
        group.markers.pull({ _id: markerId });
        group.save();
        callback(null, { marker_id: markerId });
      } else {
        callback(null, { err: 'no markers' });
      }
    }
  });
}

module.exports = {
  addMarker,
  getMarkers,
  deleteMarker,
};
