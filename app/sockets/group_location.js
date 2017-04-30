const db = require('../db');

function groupLocation(io) {
  io.of('/group_location').on('connection', (socket) => {
    socket.on('update_new_user_location', (newLocationInfo) => {
      const newLocationInfoJSON = JSON.parse(newLocationInfo);
      const groupId = newLocationInfoJSON._group_id;
      const userId = newLocationInfoJSON._user_id;
      const latlng = newLocationInfoJSON.latlng;

      db.UserRepository.findById(userId, (err, user) => {
        if (err) {
          console.log('err');
        } else if (user == null) {
          console.log('no users');
        } else {
          user.latlng.lat = latlng.lat;
          user.latlng.lng = latlng.lng;
          user.save();
          socket.emit('update_new_user_location_callback', newLocationInfo);
          socket.broadcast.emit('update_new_user_location_callback', newLocationInfo);
        }
      });
    });

    socket.on('get_all_users_location', (groupInfo) => {
      const groupJSON = JSON.parse(groupInfo);
      const groupId = groupJSON._group_id;
      db.GroupRepository.findById(groupId).populate('users').populate('latlng').exec((err, group) => {
        if (err) {
          console.log('err');
        } else if (group == null) {
          console.log('no group');
        } else {
          const users = group.users;
          let locations = [];
          for (let i = 0; i < users.length; i += 1) {
            if (users[i].latlng != null) {
              locations.push({ _id: users[i]._id, latlng: users[i].latlng });
            }
          }
          socket.emit('get_all_users_location_callback', { latlngs: locations });
        }
      });
    });

    socket.on('add_marker', (markerInfo) => {
      const markerInfoJSON = JSON.parse(markerInfo);
      const groupId = markerInfoJSON._group_id;
      const userId = markerInfoJSON._user_id;
      const lat = markerInfoJSON.lat;
      const lng = markerInfoJSON.lng;

      db.GroupRepository.findById(groupId, (err, group) => {
        if (err) {
          console.log('err');
        } else if (group == null) {
          console.log('no group');
        } else {
          const marker = { lat, lng, user: userId };
          group.markers.push(marker);
          console.log(group);
          group.save();
          socket.emit('add_marker_callback', marker);
          socket.broadcast.emit('add_marker_callback', marker);
        }
      });
    });

    socket.on('get_all_markers', (groupInfo) => {
      const groupInfoJSON = JSON.parse(groupInfo);
      const groupId = groupInfoJSON._group_id;

      db.GroupRepository.findById(groupId, (err, group) => {
        if (err) {
          console.log('err');
        } else if (group == null) {
          console.log('no group');
        } else {
          const markers = group.markers;
          console.log(markers);
          socket.emit('get_all_markers_callback', markers);
        }
      });
    });
  });
}

module.exports = groupLocation;
