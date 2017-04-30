const latlngModel = require('../models/latlng');
const markerModel = require('../models/marker');

function updateNewUserLocation(newLocationInfo, callback) {
  const newLocationInfoJSON = JSON.parse(newLocationInfo);
  const groupId = newLocationInfoJSON._group_id;
  const userId = newLocationInfoJSON._user_id;
  const latlng = newLocationInfoJSON.latlng;
  latlngModel.updateUserLatlng(groupId, userId, latlng, (err, data) => {
    callback(err, data);
  });
}

function getAllUsersLocation(groupInfo, callback) {
  const groupJSON = JSON.parse(groupInfo);
  const groupId = groupJSON._group_id;
  latlngModel.getUsersLatlng(groupId, (err, data) => {
    callback(err, data);
  });
}

function addMarker(markerInfo, callback) {
  const markerInfoJSON = JSON.parse(markerInfo);
  const groupId = markerInfoJSON._group_id;
  const userId = markerInfoJSON._user_id;
  const lat = markerInfoJSON.lat;
  const lng = markerInfoJSON.lng;
  markerModel.addMarker(groupId, userId, lat, lng, (err, data) => {
    callback(err, data);
  });
}

function getAllMarkers(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON._group_id;
  markerModel.getMarkers(groupId, (err, data) => {
    callback(err, data);
  });
}

function groupLocation(io) {
  io.of('/group_location').on('connection', (socket) => {
    socket.on('update_new_user_location', (newLocationInfo) => {
      updateNewUserLocation(newLocationInfo, (err, data) => {
        socket.emit('update_new_user_location_callback', data);
        socket.broadcast.emit('update_new_user_location_callback', data);
      });
    });

    socket.on('get_all_users_location', (groupInfo) => {
      getAllUsersLocation(groupInfo, (err, data) => {
        socket.emit('get_all_users_location_callback', data);
      });
    });

    socket.on('add_marker', (markerInfo) => {
      addMarker(markerInfo, (err, data) => {
        socket.emit('add_marker_callback', data);
        socket.broadcast.emit('add_marker_callback', data);
      });
    });

    socket.on('get_all_markers', (groupInfo) => {
      getAllMarkers(groupInfo, (err, data) => {
        socket.emit('get_all_markers_callback', data);
      });
    });
  });
}

module.exports = groupLocation;
