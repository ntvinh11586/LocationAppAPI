const latlngModel = require('../models/latlng');
const markerModel = require('../models/marker');

function updateNewUserLocation(newLocationInfo, callback) {
  const newLocationInfoJSON = JSON.parse(newLocationInfo);
  const groupId = newLocationInfoJSON.group_id;
  const userId = newLocationInfoJSON.user_id;
  const latlng = newLocationInfoJSON.latlng;
  latlngModel.updateUserLatlng(groupId, userId, latlng, (err, data) => {
    callback(err, data);
  });
}

function getAllUsersLocation(groupInfo, callback) {
  const groupJSON = JSON.parse(groupInfo);
  const groupId = groupJSON.group_id;
  latlngModel.getUsersLatlng(groupId, (err, data) => {
    callback(err, data);
  });
}

function addMarker(markerInfo, callback) {
  const markerInfoJSON = JSON.parse(markerInfo);
  const groupId = markerInfoJSON.group_id;
  const userId = markerInfoJSON.user_id;
  const lat = markerInfoJSON.latlng.lat;
  const lng = markerInfoJSON.latlng.lng;
  markerModel.addMarker(groupId, userId, lat, lng, (err, data) => {
    callback(err, data);
  });
}

function getAllMarkers(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  markerModel.getMarkers(groupId, (err, data) => {
    callback(err, data);
  });
}

function deleteMarker(markerInfo, callback) {
  const markerInfoJSON = JSON.parse(markerInfo);
  const groupId = markerInfoJSON.group_id;
  const markerId = markerInfoJSON.marker_id;
  markerModel.deleteMarker(groupId, markerId, (err, data) => {
    callback(err, data);
  });
}

function groupLocation(io) {
  io.of('/maps').on('connection', (socket) => {
    socket.on('update_latlng', (newLocationInfo) => {
      updateNewUserLocation(newLocationInfo, (err, data) => {
        socket.emit('update_latlng_callback', data);
        socket.broadcast.emit('update_latlng_callback', data);
      });
    });

    socket.on('get_latlngs', (groupInfo) => {
      getAllUsersLocation(groupInfo, (err, data) => {
        socket.emit('get_latlngs_callback', data);
      });
    });

    socket.on('add_marker', (markerInfo) => {
      addMarker(markerInfo, (err, data) => {
        socket.emit('add_marker_callback', data);
        socket.broadcast.emit('add_marker_callback', data);
      });
    });

    socket.on('delete_marker', (markerInfo) => {
      deleteMarker(markerInfo, (err, data) => {
        socket.emit('delete_marker_callback', data);
        socket.broadcast.emit('delete_marker_callback', data);
      });
    });

    socket.on('get_markers', (groupInfo) => {
      getAllMarkers(groupInfo, (err, data) => {
        socket.emit('get_markers_callback', data);
      });
    });
  });
}

module.exports = groupLocation;
