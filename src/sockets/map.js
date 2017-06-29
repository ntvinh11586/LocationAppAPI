const latlngModel = require('../models/latlng');
const groupModel = require('../models/group');
const socketioJwt = require('socketio-jwt');
const config = require('../config');
const notificationDomain = require('../domains/notification');
const appointmentDomain = require('../domains/appointment');
const fcmDomain = require('../domains/fcm');
const locationDomain = require('../domains/location');
const cacheDomain = require('../domains/cache');

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
      socket.on('update_latlng', (body) => {
        const {
          user_id: userId,
          group_id: groupId,
          latlng,
        } = JSON.parse(body);

        const response = {
          user_id: userId,
          group_id: groupId,
          latlng,
        };

        // Emit & broadcast data
        socket.emit('update_latlng_callback', response);
        cacheDomain.loadUserInfo({ userId })
          .then((cachedUserData) => {
            if (cachedUserData.groups !== undefined
              && cachedUserData.groups.length > 0) {
              cachedUserData.groups.forEach((group) => {
                socket.join(group);
                socket.broadcast.to(group).emit('update_latlng_callback', response);
              });
            }
          })
          .then(() => {
            // Write Through Strategy: Update Cache and DB
            cacheDomain.setUserInfo({ userId, latlng });
            latlngModel.updateUserLatlng(groupId, userId, latlng, () => {});
          });
      });

      socket.on('get_latlng', (body) => {
        getUserLocation(body)
          .then((data) => {
            socket.emit('get_latlng_callback', data);
          });
      });

      socket.on('get_latlngs', (body) => {
        getAllUsersLocation(body, (err, data) => {
          socket.emit('get_latlngs_callback', data);
        });
      });

      socket.on('add_arriving_user', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);

        groupModel.addArrivingUser(groupId, userId, (err, data) => {
          // Emit & broadcast data
          socket.emit('add_arriving_user_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('add_arriving_user_callback', data);

          notificationDomain.addNotification({
            content: 'You are in starting point',
            type: 'in_starting_point',
            date: (new Date()).getTime(),
            userId,
          });

          console.log(groupId);
          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.username} is at Starting Point now!`,
              },
              data: {
                group_id: JSON.stringify(data.group_id),
                user_id: JSON.stringify(data.user_id),
                type: 'maps',
              },
            });
          });
        });
      });

      socket.on('delete_arriving_user', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);

        deleteArrivingUser(body, (err, data) => {
          socket.emit('delete_arriving_user_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('delete_arriving_user_callback', data);

          notificationDomain.addNotification({
            content: 'You are out starting point',
            type: 'out_starting_point',
            date: (new Date()).getTime(),
            userId,
          });

          console.log(groupId);
          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.username || data.user_id} left Starting Point now!`,
              },
              data: {
                group_id: JSON.stringify(data.group_id),
                user_id: JSON.stringify(data.user_id),
                type: 'maps',
              },
            });
          });
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

      socket.on('add_destination_user', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);

        addDestinationUser(body, (err, data) => {
          socket.emit('add_destination_user_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('add_destination_user_callback', data);

          notificationDomain.addNotification({
            content: 'You are in ending point',
            type: 'in_ending_point',
            date: (new Date()).getTime(),
            userId,
          });

          console.log(groupId);
          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.username || data.user_id} is at Ending Point now!`,
              },
              data: {
                group_id: JSON.stringify(data.group_id),
                user_id: JSON.stringify(data.user_id),
                type: 'maps',
              },
            });
          });
        });
      });

      socket.on('delete_destination_user', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);

        deleteDestinationUser(body, (err, data) => {
          socket.emit('delete_destination_user_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('delete_destination_user_callback', data);

          notificationDomain.addNotification({
            content: 'You are out ending point',
            type: 'out_ending_poing',
            date: (new Date()).getTime(),
            userId,
          });

          console.log(groupId);
          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.username || data.user_id} left Ending Point now!`,
              },
              data: {
                group_id: JSON.stringify(data.group_id),
                user_id: JSON.stringify(data.user_id),
                type: 'maps',
              },
            });
          });
        });
      });

      socket.on('add_user_into_stopover', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);

        addUserIntoStopover(body, (err, data) => {
          socket.emit('add_user_into_stopover_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('add_user_into_stopover_callback', data);

          notificationDomain.addNotification({
            content: 'You are in stopover',
            type: 'in_stopover',
            date: (new Date()).getTime(),
            userId,
          });

          console.log(groupId);
          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.username || data.user_id} is at Stopover ${data.stopover_position}!`,
              },
              data: {
                group_id: JSON.stringify(data.group_id),
                user_id: JSON.stringify(data.user_id),
                type: 'maps',
              },
            });
          });
        });
      });

      socket.on('delete_user_into_stopover', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);

        deleteUserIntoStopover(body, (err, data) => {
          socket.emit('delete_user_into_stopover_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('delete_user_into_stopover_callback', data);

          notificationDomain.addNotification({
            content: 'You are out stopover',
            type: 'out_stopover',
            date: (new Date()).getTime(),
            userId,
          });

          console.log(groupId);
          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.username || data.user_id} left Stopover ${data.stopover_position} now!`,
              },
              data: {
                group_id: JSON.stringify(data.group_id),
                user_id: JSON.stringify(data.user_id),
                type: 'maps',
              },
            });
          });
        });
      });

      socket.on('add_route', (body) => {
        const { group_id: groupId } = JSON.parse(body);

        addRoute(body, (err, data) => {
          socket.emit('add_route_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('add_route_callback', data);
        });
      });

      socket.on('get_route', (groupInfo) => {
        getRoute(groupInfo, (err, data) => {
          socket.emit('get_route_callback', data);
        });
      });

      socket.on('delete_route', (body) => {
        const { group_id: groupId } = JSON.parse(body);

        deleteRoute(body, (err, data) => {
          socket.emit('delete_route_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('delete_route_callback', data);
        });
      });

      // Appointment
      socket.on('get_appointments', (groupInfo) => {
        getAppointments(groupInfo)
          .then((data) => {
            socket.emit('get_appointments_callback', data);
          });
      });

      socket.on('add_appointment', (body) => {
        const { group_id: groupId } = JSON.parse(body);

        addAppointment(body)
          .then((data) => {
            socket.emit('add_appointment_callback', data);
            socket.join(groupId);
            socket.broadcast.to(groupId).emit('add_appointment_callback', data);
          });
      });

      socket.on('delete_appointment', (body) => {
        const { group_id: groupId } = JSON.parse(body);

        deleteAppointment(body)
          .then((data) => {
            socket.emit('delete_appointment_callback', data);
            socket.join(groupId);
            socket.broadcast.to(groupId).emit('delete_appointment_callback', data);
          });
      });

      socket.on('add_user_to_appointment', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);

        addUserToAppointment(body)
          .then((data) => {
            socket.emit('add_user_to_appointment_callback', data);
            socket.join(groupId);
            socket.broadcast.to(groupId).emit('add_user_to_appointment_callback', data);

            notificationDomain.addNotification({
              content: 'You are in starting point',
              type: 'in_starting_point',
              date: (new Date()).getTime(),
              userId,
            });

            console.log(groupId);
            notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
              fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                notification: {
                  title: data.name || data.group_id,
                  body: `${data.username || data.user_id} is at appointment ${data.appointment_id} now!`,
                },
                data: {
                  group_id: JSON.stringify(data.group_id),
                  user_id: JSON.stringify(data.user_id),
                  type: 'maps',
                },
              });
            });
          });
      });

      socket.on('delete_user_from_appointment', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);

        deleteUserToAppointment(body)
          .then((data) => {
            socket.emit('delete_user_from_appointment_callback', data);
            socket.join(groupId);
            socket.broadcast.to(groupId).emit('delete_user_from_appointment_callback', data);

            notificationDomain.addNotification({
              content: 'You are in starting point',
              type: 'in_starting_point',
              date: (new Date()).getTime(),
              userId,
            });

            notificationDomain.notifyNewMessage(groupId, (err, dTokens) => {
              fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                notification: {
                  title: data.name || data.group_id,
                  body: `${data.username || data.user_id} left appointment ${data.appointment_id} now!`,
                },
                data: {
                  group_id: JSON.stringify(data.group_id),
                  user_id: JSON.stringify(data.user_id),
                  type: 'maps',
                },
              });
            });
          });
      });

      socket.on('disconnect', () => {
        // TODO Should do anything when disconnect`
        // socket.leave(room);
      });
    });
}

module.exports = groupLocation;
