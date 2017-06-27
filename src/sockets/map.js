const latlngModel = require('../models/latlng');
const groupModel = require('../models/group');
const socketioJwt = require('socketio-jwt');
const config = require('../config');
const notificationDomain = require('../domains/notification');
const appointmentDomain = require('../domains/appointment');
const fcmDomain = require('../domains/fcm');
const locationDomain = require('../domains/location');
const cacheDomain = require('../domains/cache');

function joinChat(socket, groupId) {
  if (groupId === undefined || groupId === null) {
    socket.emit('error', {
      message_code: 422,
      success: true,
      status_message: 'Group Id not found',
    });
  } else {
    socket.join(groupId);
  }

  return socket;
}

function getAllUsersLocation(groupInfo, callback) {
  const groupJSON = JSON.parse(groupInfo);
  const groupId = groupJSON.group_id;
  latlngModel.getUsersLatlng(groupId, (err, data) => {
    callback(err, data);
  });
}

function getUserLocation(body) {
  const { user_id: userId } = JSON.parse(body);
  return locationDomain.getUserCurrentLocation({ userId });
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

function addUserIntoStopover(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const userId = groupInfoJSON.user_id;
  const stopoverId = groupInfoJSON.stopover_id;
  groupModel.addUserIntoStopover(groupId, userId, stopoverId, (err, data) => {
    callback(err, data);
  });
}

function deleteUserIntoStopover(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const userId = groupInfoJSON.user_id;
  const stopoverId = groupInfoJSON.stopover_id;
  groupModel.deleteUserIntoStopover(groupId, userId, stopoverId, (err, data) => {
    callback(err, data);
  });
}

function addRoute(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const startLatlng = groupInfoJSON.start_latlng;
  const endLatlng = groupInfoJSON.end_latlng;
  const stopovers = groupInfoJSON.stopovers;
  const startRadius = groupInfoJSON.start_radius;
  const endRadius = groupInfoJSON.end_radius;
  groupModel.addRoute(groupId,
    startLatlng,
    endLatlng,
    startRadius,
    endRadius,
    stopovers,
    (err, data) => {
      callback(err, data);
    });
}

function getRoute(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  groupModel.getRoute(groupId, (err, data) => {
    callback(err, data);
  });
}

function deleteRoute(groupInfo, callback) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  groupModel.deleteRoute(groupId, (err, data) => {
    callback(err, data);
  });
}

// Appointment
function getAppointments(groupInfo) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  return appointmentDomain.getAppointments({ groupId });
}

function addAppointment(groupInfo) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const address = groupInfoJSON.address;
  const latlng = groupInfoJSON.latlng;
  const startTime = groupInfoJSON.start_time;
  const endTime = groupInfoJSON.end_time;
  const radius = groupInfoJSON.radius;
  return appointmentDomain.addAppointment({ groupId, latlng, address, startTime, endTime, radius });
}

function deleteAppointment(groupInfo) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const appointmentId = groupInfoJSON.appointment_id;
  return appointmentDomain.deleteAppointment({ groupId, appointmentId });
}

function addUserToAppointment(groupInfo) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const appointmentId = groupInfoJSON.appointment_id;
  const userId = groupInfoJSON.user_id;
  return appointmentDomain.addUserToAppointment({ groupId, appointmentId, userId });
}

function deleteUserToAppointment(groupInfo) {
  const groupInfoJSON = JSON.parse(groupInfo);
  const groupId = groupInfoJSON.group_id;
  const appointmentId = groupInfoJSON.appointment_id;
  const userId = groupInfoJSON.user_id;
  return appointmentDomain.deleteUserFromAppointment({ groupId, appointmentId, userId });
}

function groupLocation(mapNamespace) {
  mapNamespace
    .on('connection', socketioJwt.authorize({
      secret: config.tokenSecretKey,
      timeout: config.networkTimeout,
    }))
    .on('authenticated', (socket) => {
      joinChat(socket, socket.handshake.query.group_id)
        .on('update_latlng', (body) => {
          const { user_id: userId, group_id: groupId, latlng } = JSON.parse(body);
          const response = { user_id: userId, group_id: groupId, latlng };

          socket.emit('update_latlng_callback', response);
          socket.broadcast.to(groupId).emit('update_latlng_callback', response);
          cacheDomain.setUserInfo({ userId, latlng });
          latlngModel.updateUserLatlng(groupId, userId, latlng, (err, data) => {
            console.log(data);
          });
        })
        .on('get_latlng', (body) => {
          getUserLocation(body)
            .then((data) => {
              socket.emit('get_latlng_callback', data);
            });
        })
        .on('get_latlngs', (groupInfo) => {
          getAllUsersLocation(groupInfo, (err, data) => {
            socket.emit('get_latlngs_callback', data);
          });
        })
        .on('add_arriving_user', (groupInfo) => {
          addArrivingUser(groupInfo, (err, data) => {
            socket.emit('add_arriving_user_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('add_arriving_user_callback', data);

            notificationDomain.addNotification({
              content: 'You are in starting point',
              type: 'in_starting_point',
              user: data.user_id,
            })
            .then()
            .catch();

            console.log(socket.handshake.query.group_id);
            notificationDomain.notifyNewMessage(
              socket.handshake.query.group_id,
              (err, dTokens) => {
                fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                  notification: {
                    title: data.name,
                    body: `${data.username} is at Starting Point now!`,
                  },
                });
              });
          });
        })
        .on('delete_arriving_user', (groupInfo) => {
          deleteArrivingUser(groupInfo, (err, data) => {
            socket.emit('delete_arriving_user_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('delete_arriving_user_callback', data);

            notificationDomain.addNotification({
              content: 'You are out starting point',
              type: 'out_starting_point',
              user: data.user_id,
            })
            .then()
            .catch();

            console.log(socket.handshake.query.group_id);
            notificationDomain.notifyNewMessage(
              socket.handshake.query.group_id,
              (err, dTokens) => {
                fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                  notification: {
                    title: data.name,
                    body: `${data.username} left Starting Point now!`,
                  },
                });
              });
          });
        })
        .on('get_arriving_users', (groupInfo) => {
          getArrivingUsers(groupInfo, (err, data) => {
            socket.emit('get_arriving_users_callback', data);
          });
        })
        .on('get_destination_users', (groupInfo) => {
          getDestinationUsers(groupInfo, (err, data) => {
            socket.emit('get_destination_users_callback', data);
          });
        })
        .on('add_destination_user', (groupInfo) => {
          addDestinationUser(groupInfo, (err, data) => {
            socket.emit('add_destination_user_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('add_destination_user_callback', data);

            notificationDomain.addNotification({
              content: 'You are in ending point',
              type: 'in_ending_point',
              user: data.user_id,
            })
            .then()
            .catch();

            console.log(socket.handshake.query.group_id);
            notificationDomain.notifyNewMessage(
              socket.handshake.query.group_id,
              (err, dTokens) => {
                fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                  notification: {
                    title: data.name,
                    body: `${data.username} is at Ending Point now!`,
                  },
                });
              });
          });
        })
        .on('delete_destination_user', (groupInfo) => {
          deleteDestinationUser(groupInfo, (err, data) => {
            socket.emit('delete_destination_user_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('delete_destination_user_callback', data);

            notificationDomain.addNotification({
              content: 'You are out ending point',
              type: 'out_ending_poing',
              user: data.user_id,
            })
            .then()
            .catch();

            console.log(socket.handshake.query.group_id);
            notificationDomain.notifyNewMessage(
              socket.handshake.query.group_id,
              (err, dTokens) => {
                fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                  notification: {
                    title: data.name,
                    body: `${data.username} left Ending Point now!`,
                  },
                });
              });
          });
        })
        .on('delete_starting_point', (groupInfo) => {
          deleteStartingPoint(groupInfo, (err, data) => {
            socket.emit('delete_starting_point_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('delete_starting_point_callback', data);
          });
        })
        .on('delete_ending_point', (groupInfo) => {
          deleteEndingPoint(groupInfo, (err, data) => {
            socket.emit('delete_ending_point_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('delete_ending_point_callback', data);
          });
        })
        .on('add_user_into_stopover', (groupInfo) => {
          addUserIntoStopover(groupInfo, (err, data) => {
            socket.emit('add_user_into_stopover_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('add_user_into_stopover_callback', data);

            notificationDomain.addNotification({
              content: 'You are in stopover',
              type: 'in_stopover',
              user: data.user_id,
            })
            .then()
            .catch();

            console.log(socket.handshake.query.group_id);
            notificationDomain.notifyNewMessage(
              socket.handshake.query.group_id,
              (err, dTokens) => {
                fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                  notification: {
                    title: data.name,
                    body: `${data.username} is at Stopover ${data.stopover_position}!`,
                  },
                });
              });
          });
        })
        .on('delete_user_into_stopover', (groupInfo) => {
          deleteUserIntoStopover(groupInfo, (err, data) => {
            socket.emit('delete_user_into_stopover_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('delete_user_into_stopover_callback', data);

            notificationDomain.addNotification({
              content: 'You are out stopover',
              type: 'out_stopover',
              user: data.user_id,
            })
            .then()
            .catch();

            console.log(socket.handshake.query.group_id);
            notificationDomain.notifyNewMessage(
              socket.handshake.query.group_id,
              (err, dTokens) => {
                fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                  notification: {
                    title: data.name,
                    body: `${data.username} left Stopover ${data.stopover_position} now!`,
                  },
                });
              });
          });
        })
        .on('add_route', (groupInfo) => {
          addRoute(groupInfo, (err, data) => {
            socket.emit('add_route_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('add_route_callback', data);
          });
        })
        .on('get_route', (groupInfo) => {
          getRoute(groupInfo, (err, data) => {
            socket.emit('get_route_callback', data);
          });
        })
        .on('delete_route', (groupInfo) => {
          deleteRoute(groupInfo, (err, data) => {
            socket.emit('delete_route_callback', data);
            socket.broadcast
              .to(socket.handshake.query.group_id)
              .emit('delete_route_callback', data);
          });
        })
        // Appointment
        .on('get_appointments', (groupInfo) => {
          getAppointments(groupInfo)
            .then((data) => {
              socket.emit('get_appointments_callback', data);
            });
        })
        .on('add_appointment', (groupInfo) => {
          addAppointment(groupInfo)
            .then((data) => {
              socket.emit('add_appointment_callback', data);
              socket.broadcast
                .to(socket.handshake.query.group_id)
                .emit('add_appointment_callback', data);
            });
        })
        .on('delete_appointment', (groupInfo) => {
          deleteAppointment(groupInfo)
            .then((data) => {
              socket.emit('delete_appointment_callback', data);
              socket.broadcast
                .to(socket.handshake.query.group_id)
                .emit('delete_appointment_callback', data);
            });
        })
        .on('add_user_to_appointment', (groupInfo) => {
          addUserToAppointment(groupInfo)
            .then((data) => {
              socket.emit('add_user_to_appointment_callback', data);
              socket.broadcast
                .to(socket.handshake.query.group_id)
                .emit('add_user_to_appointment_callback', data);
            });
        })
        .on('delete_user_from_appointment', (groupInfo) => {
          deleteUserToAppointment(groupInfo)
            .then((data) => {
              socket.emit('delete_user_from_appointment_callback', data);
              socket.broadcast
                .to(socket.handshake.query.group_id)
                .emit('delete_user_from_appointment_callback', data);
            });
        })
        .on('disconnect', () => {
          const room = socket.handshake.query.group_id;
          socket.leave(room);
        });
    });
}

module.exports = groupLocation;
