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

module.exports = {
  addMarker,
  getMarkers,
};
