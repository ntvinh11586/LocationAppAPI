const latlngModel = require('../models/latlng');
const markerModel = require('../models/marker');
const groupModel = require('../models/group');

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

function updateStartingPoint(startingPointInfo, callback) {
  const startingPointInfoJSON = JSON.parse(startingPointInfo);
  const groupId = startingPointInfoJSON.group_id;
  const startLatlng = startingPointInfoJSON.start_latlng;
  const startTime = startingPointInfoJSON.start_time;
  groupModel.updateStartingPoint(groupId, startTime, startLatlng, (err, data) => {
    callback(err, data);
  });
}

function updateEndingPoint(endingPointInfo, callback) {
  const endingPointInfoJSON = JSON.parse(endingPointInfo);
  const groupId = endingPointInfoJSON.group_id;
  const endLatlng = endingPointInfoJSON.end_latlng;
  const endTime = endingPointInfoJSON.end_time;
  groupModel.updateEndingPoint(groupId, endTime, endLatlng, (err, data) => {
    callback(err, data);
  });
}

function getStartingPoint(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  groupModel.getStartingPoint(groupId, (err, data) => {
    callback(err, data);
  });
}

function getEndingPoint(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  groupModel.getEndingPoint(groupId, (err, data) => {
    callback(err, data);
  });
}

function addArrivingUser(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const userId = groupInfoJSON.user_id;
  groupModel.addArrivingUser(groupId, userId, (err, data) => {
    callback(err, data);
  });
}

function addDestinationUser(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const userId = groupInfoJSON.user_id;
  groupModel.addDestinationUser(groupId, userId, (err, data) => {
    callback(err, data);
  });
}

function deleteArrivingUser(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const userId = groupInfoJSON.user_id;
  groupModel.deleteArrivingUser(groupId, userId, (err, data) => {
    callback(err, data);
  });
}

function deleteDestinationUser(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const userId = groupInfoJSON.user_id;
  groupModel.deleteDestinationUser(groupId, userId, (err, data) => {
    callback(err, data);
  });
}

function getArrivingUsers(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  groupModel.getArrivingUsers(groupId, (err, data) => {
    callback(err, data);
  });
}

function getDestinationUsers(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  groupModel.getDestinationUsers(groupId, (err, data) => {
    callback(err, data);
  });
}

function deleteStartingPoint(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  groupModel.deleteStartingPoint(groupId, (err, data) => {
    callback(err, data);
  });
}

function deleteEndingPoint(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  groupModel.deleteEndingPoint(groupId, (err, data) => {
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

    socket.on('update_starting_point', (startingPointInfo) => {
      updateStartingPoint(startingPointInfo, (err, data) => {
        socket.emit('update_starting_point_callback', data);
        socket.broadcast.emit('update_starting_point_callback', data);
      });
    });

    socket.on('update_ending_point', (endingPointInfo) => {
      updateEndingPoint(endingPointInfo, (err, data) => {
        socket.emit('update_ending_point_callback', data);
        socket.broadcast.emit('update_ending_point_callback', data);
      });
    });

    socket.on('get_starting_point', (groupInfo) => {
      getStartingPoint(groupInfo, (err, data) => {
        socket.emit('get_starting_point_callback', data);
      });
    });

    socket.on('update_ending_point', (endingPointInfo) => {
      updateEndingPoint(endingPointInfo, (err, data) => {
        socket.emit('update_ending_point_callback', data);
        socket.broadcast.emit('update_ending_point_callback', data);
      });
    });

    socket.on('get_ending_point', (groupInfo) => {
      getEndingPoint(groupInfo, (err, data) => {
        socket.emit('get_ending_point_callback', data);
      });
    });

    socket.on('add_arriving_user', (groupInfo) => {
      addArrivingUser(groupInfo, (err, data) => {
        socket.emit('add_arriving_user_callback', data);
        socket.broadcast.emit('add_arriving_user_callback', data);
      });
    });

    socket.on('delete_arriving_user', (groupInfo) => {
      deleteArrivingUser(groupInfo, (err, data) => {
        socket.emit('delete_arriving_user_callback', data);
        socket.broadcast.emit('delete_arriving_user_callback', data);
      });
    });

    socket.on('get_arriving_users', (groupInfo) => {
      getArrivingUsers(groupInfo, (err, data) => {
        socket.emit('get_arriving_users_callback', data);
      });
    });

    socket.on('get_destination_users', (groupInfo) => {
      getDestinationUsers(groupInfo, (err, data) => {
        socket.emit('get_destination_users_callback', data);
      });
    });

    socket.on('add_destination_user', (groupInfo) => {
      addDestinationUser(groupInfo, (err, data) => {
        socket.emit('add_destination_user_callback', data);
        socket.broadcast.emit('add_destination_user_callback', data);
      });
    });

    socket.on('delete_destination_user', (groupInfo) => {
      deleteDestinationUser(groupInfo, (err, data) => {
        socket.emit('delete_destination_user_callback', data);
        socket.broadcast.emit('delete_destination_user_callback', data);
      });
    });

    socket.on('delete_starting_point', (groupInfo) => {
      deleteStartingPoint(groupInfo, (err, data) => {
        socket.emit('delete_starting_point_callback', data);
        socket.broadcast.emit('delete_starting_point_callback', data);
      });
    });

    socket.on('delete_ending_point', (groupInfo) => {
      deleteEndingPoint(groupInfo, (err, data) => {
        socket.emit('delete_ending_point_callback', data);
        socket.broadcast.emit('delete_ending_point_callback', data);
      });
    });

    function addStopover(groupInfo, callback) {
      const groupInfoJSON = JSON.parse(groupInfo);
      const groupId = groupInfoJSON.group_id;
      const latlng = groupInfoJSON.latlng;
      const position = groupInfoJSON.position;
      groupModel.addStopover(groupId, latlng, position, (err, data) => {
        callback(err, data);
      });
    }

    socket.on('add_stopover', (groupInfo) => {
      addStopover(groupInfo, (err, data) => {
        socket.emit('add_stopover_callback', data);
        socket.broadcast.emit('add_stopover_callback', data);
      })
    });
  });
}

module.exports = groupLocation;
