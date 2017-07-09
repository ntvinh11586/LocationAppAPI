const latlngModel = require('../models/latlng');
const groupModel = require('../models/group');
const socketioJwt = require('socketio-jwt');
const config = require('../config');
const notificationDomain = require('../domains/notification');
const appointmentDomain = require('../domains/appointment');
const fcmDomain = require('../domains/fcm');
const locationDomain = require('../domains/location');
const cacheDomain = require('../domains/cache');
const groupDomain = require('../domains/group');
const userModel = require('../models/user');

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
            if (cachedUserData.groups !== null
              && cachedUserData.groups !== undefined
              && cachedUserData.groups.length > 0) {
              cachedUserData.groups.forEach((group) => {
                socket.join(group);

                const responseForBoardcast = {
                  user_id: userId,
                  group_id: group,
                  latlng,
                };

                if (group !== undefined) {
                  socket.broadcast.to(group).emit('update_latlng_callback', responseForBoardcast);
                }
              });
            }
          })
          .then(() => {
            // Write Through Strategy: Update Cache and DB
            cacheDomain.setUserInfo({ userId, latlng });
            latlngModel.updateUserLatlng(groupId, userId, latlng, () => {});
          });
      });

      socket.on('get_latlng_synchronization', (body) => {
        const { user_id: userId } = JSON.parse(body);

        setInterval(() => {
          locationDomain.getUserCurrentLocation({ userId })
            .then((data) => {
              cacheDomain.loadUserInfo({ userId })
                .then((cachedUserData) => {
                  if (cachedUserData.groups !== undefined
                    && cachedUserData.groups.length > 0) {
                    cachedUserData.groups.forEach((group) => {
                      socket.join(group);

                      const response = {
                        user_id: userId,
                        group_id: group,
                        latlng: data.latlng,
                      };

                      socket.emit('get_latlng_synchronization_callback', response);
                      socket.broadcast.to(group).emit('get_latlng_synchronization_callback', response);
                    });
                  }
                });
            });
        }, 1000);
      });

      socket.on('get_latlng', (body) => {
        const { user_id: userId } = JSON.parse(body);
        locationDomain.getUserCurrentLocation({ userId })
          .then((data) => {
            socket.emit('get_latlng_callback', data);
          });
      });

      socket.on('get_latlngs', (body) => {
        const { group_id: groupId } = JSON.parse(body);
        latlngModel.getUsersLatlng(groupId, (err, data) => {
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
            content: 'Bạn đang ở điểm bắt đầu hành trình',
            type: 'map',
            date: (new Date()).getTime(),
            userId,
          });

          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.fullname || data.username} đang ở điểm bắt đầu hành trình`,
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

      socket.on('notify_getting_lost', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);
        const { username, group_name: groupName } = JSON.parse(body);

        const response = {
          user_id: userId,
          group_id: groupId,
          username,
          group_name: groupName,
        };

        socket.emit('notify_getting_lost_callback', response);
        socket.broadcast.to(groupId).emit('notify_getting_lost_callback', response);

        notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
          fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
            notification: {
              title: groupName || groupId,
              body: `${username || userId} đã đi lạc.`,
            },
            data: {
              group_id: JSON.stringify(groupId),
              user_id: JSON.stringify(userId),
              type: 'maps',
            },
          });
        });
      });

      socket.on('delete_arriving_user', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);

        groupModel.deleteArrivingUser(groupId, userId, (err, data) => {
          socket.emit('delete_arriving_user_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('delete_arriving_user_callback', data);

          notificationDomain.addNotification({
            content: 'Bạn đã ra khỏi điểm bắt đầu hành trình',
            type: 'map',
            date: (new Date()).getTime(),
            userId,
          });

          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.fullname || data.username || data.user_id} đã ra khỏi điểm bắt đầu hành trình.`,
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
        const { group_id: groupId } = JSON.parse(groupInfo);
        groupModel.getArrivingUsers(groupId, (err, data) => {
          socket.emit('get_arriving_users_callback', data);
        });
      });

      socket.on('get_destination_users', (groupInfo) => {
        const { group_id: groupId } = JSON.parse(groupInfo);
        groupModel.getDestinationUsers(groupId, (err, data) => {
          socket.emit('get_destination_users_callback', data);
        });
      });

      socket.on('add_destination_user', (body) => {
        const { user_id: userId, group_id: groupId } = JSON.parse(body);

        groupModel.addDestinationUser(groupId, userId, (err, data) => {
          socket.emit('add_destination_user_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('add_destination_user_callback', data);

          notificationDomain.addNotification({
            content: 'Bạn đang ở điểm kết thúc hành trình.',
            type: 'map',
            date: (new Date()).getTime(),
            userId,
          });

          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.fullname || data.username || data.user_id} đang ở điểm kết thúc hành trình.`,
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

        groupModel.deleteDestinationUser(groupId, userId, (err, data) => {
          socket.emit('delete_destination_user_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('delete_destination_user_callback', data);

          notificationDomain.addNotification({
            content: 'Bạn đã ra khỏi điểm kết thúc của hành trình.',
            type: 'map',
            date: (new Date()).getTime(),
            userId,
          });

          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.fullname || data.username || data.user_id} đã ra khỏi điểm kết thúc của hành trình.`,
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
        const {
          user_id: userId,
          group_id: groupId,
          stopover_id: stopoverId,
        } = JSON.parse(body);

        groupModel.addUserIntoStopover(groupId, userId, stopoverId, (err, data) => {
          socket.emit('add_user_into_stopover_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('add_user_into_stopover_callback', data);

          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.fullname || data.username || data.user_id} đang ở điểm dừng chân thứ ${data.stopover_position}!`,
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
        const {
          user_id: userId,
          group_id: groupId,
          stopover_id: stopoverId,
        } = JSON.parse(body);

        groupModel.deleteUserIntoStopover(groupId, userId, stopoverId, (err, data) => {
          socket.emit('delete_user_into_stopover_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('delete_user_into_stopover_callback', data);

          notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
            fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
              notification: {
                title: data.name || data.group_id,
                body: `${data.fullname || data.username || data.user_id} ra khỏi điểm dừng chân thứ ${data.stopover_position}.`,
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
        const {
          group_id: groupId,
          start_latlng: startLatlng,
          end_latlng: endLatlng,
          stopovers,
          start_radius: startRadius,
          end_radius: endRadius,
        } = JSON.parse(body);

        groupModel.addRoute(groupId,
          startLatlng,
          endLatlng,
          startRadius,
          endRadius,
          stopovers,
          (err, data) => {
            socket.emit('add_route_callback', data);
            socket.join(groupId);
            socket.broadcast.to(groupId).emit('add_route_callback', data);
          });
      });

      socket.on('get_route', (groupInfo) => {
        const { group_id: groupId } = JSON.parse(groupInfo);
        groupModel.getRoute(groupId, (err, data) => {
          socket.emit('get_route_callback', data);
        });
      });

      socket.on('delete_route', (body) => {
        const { group_id: groupId } = JSON.parse(body);
        groupModel.deleteRoute(groupId, (err, data) => {
          socket.emit('delete_route_callback', data);
          socket.join(groupId);
          socket.broadcast.to(groupId).emit('delete_route_callback', data);
        });
      });

      // Appointment
      socket.on('get_appointments', (groupInfo) => {
        const { group_id: groupId } = JSON.parse(groupInfo);
        appointmentDomain.getAppointments({ groupId })
          .then((data) => {
            socket.emit('get_appointments_callback', data);
          });
      });

      socket.on('add_appointment', (body) => {
        const {
          group_id: groupId,
          address,
          latlng,
          start_time: startTime,
          end_time: endTime,
          radius,
        } = JSON.parse(body);

        appointmentDomain.addAppointment({ groupId, latlng, address, startTime, endTime, radius })
          .then((data) => {
            socket.emit('add_appointment_callback', data);
            socket.join(groupId);
            socket.broadcast.to(groupId).emit('add_appointment_callback', data);
          });
      });

      socket.on('delete_appointment', (body) => {
        const {
          group_id: groupId,
          appointment_id: appointmentId,
        } = JSON.parse(body);

        appointmentDomain.deleteAppointment({ groupId, appointmentId })
          .then((data) => {
            socket.emit('delete_appointment_callback', data);
            socket.join(groupId);
            socket.broadcast.to(groupId).emit('delete_appointment_callback', data);
          });
      });

      socket.on('add_user_to_appointment', (body) => {
        const {
          user_id: userId,
          group_id: groupId,
          appointment_id: appointmentId,
        } = JSON.parse(body);

        appointmentDomain.addUserToAppointment({ groupId, appointmentId, userId })
          .then((data) => {
            socket.emit('add_user_to_appointment_callback', data);
            socket.join(groupId);
            socket.broadcast.to(groupId).emit('add_user_to_appointment_callback', data);

            notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
              userModel.getUserInfo(userId, (error, userDataResponse) => {
                groupDomain.getGroup(groupId)
                  .then((groupDataResponse) => {
                    appointmentDomain.getAppointment({ appointmentId })
                      .then((appointmentDataResponse) => {
                        notificationDomain.addNotification({
                          content: `Bạn đang ở điểm hẹn ${appointmentDataResponse.address || data.appointment_id}.`,
                          type: 'map',
                          date: (new Date()).getTime(),
                          userId,
                        });

                        fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                          notification: {
                            title: groupDataResponse.name || data.group_id,
                            body: `${userDataResponse.username || data.user_id} đang ở điểm hẹn ${appointmentDataResponse.address || data.appointment_id}.`,
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
            });
          });
      });

      socket.on('delete_user_from_appointment', (body) => {
        const {
          user_id: userId,
          group_id: groupId,
          appointment_id: appointmentId,
        } = JSON.parse(body);

        appointmentDomain.deleteUserFromAppointment({ groupId, appointmentId, userId })
          .then((data) => {
            socket.emit('delete_user_from_appointment_callback', data);
            socket.join(groupId);
            socket.broadcast.to(groupId).emit('delete_user_from_appointment_callback', data);

            notificationDomain.notifyNewMessage(groupId, (err, dTokens) => {
              userModel.getUserInfo(userId, (error, userDataResponse) => {
                groupDomain.getGroup(groupId)
                  .then((groupDataResponse) => {
                    appointmentDomain.getAppointment({ appointmentId })
                      .then((appointmentDataResponse) => {
                        notificationDomain.addNotification({
                          content: `Bạn đã rời khỏi điểm hẹn ${appointmentDataResponse.address || data.appointment_id}.`,
                          type: 'map',
                          date: (new Date()).getTime(),
                          userId,
                        });

                        fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                          notification: {
                            title: groupDataResponse.name || data.group_id,
                            body: `${userDataResponse.username || data.user_id} left appointment ${appointmentDataResponse.address || data.appointment_id}.`,
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
            });
          });
      });

      socket.on('disconnect', () => {
        const userId = socket.decoded_token.user_id;
        cacheDomain.loadUserInfo({ userId })
          .then(data => data.groups)
          .then((data) => {
            const groups = [];
            data.forEach((groupId) => {
              groups.push(groupDomain.getGroup(groupId));
            });
            return Promise.all(groups);
          })
          .then((data) => {
            const groupTimes = [];
            data.forEach((group) => {
              groupTimes.push({
                _id: group.group_id,
                start_time: group.start_time,
                end_time: group.end_time,
              });
            });
            return Promise.all(groupTimes);
          })
          .then((data) => {
            return data.filter((group) => {
              return group.start_time !== undefined && group.end_time !== undefined;
            });
          })
          .then((data) => {
            const groups = [];
            data.forEach((group) => {
              groups.push(group);
              groups.push(appointmentDomain.getAppointments({ groupId: group._id }));
            });
            return Promise.all(groups);
          })
          .then((data) => {
            const groups = [];
            for (let i = 0; i < data.length; i += 2) {
              groups.push({
                _id: data[i]._id,
                start_time: data[i].start_time,
                end_time: data[i].end_time,
                appointments: data[i + 1].appointments.map((app) => {
                  return {
                    _id: app._id,
                    start_time: app.start_time,
                    end_time: app.end_time,
                  };
                }),
              });
            }
            return groups;
          })
          .then((data) => {
            const date = 1496175420001;
            const groupIds = [];

            for (let i = 0; i < data.length; i += 1) {
              if (data[i].start_time < date && date < data[i].end_time) {
                groupIds.push(data[i]._id);
              } else {
                for (let j = 0; j < data[i].appointments.length; j += 1) {
                  if (data[i].appointments.start_time < date
                    && date < data[i].appointments.end_time) {
                    groupIds.push(data[i]._id);
                    break;
                  }
                }
              }
            }
            return groupIds;
          })
          .then((data) => {
            data.forEach((groupId) => {
              notificationDomain.notifyNewMessage(groupId, (error, dTokens) => {
                userModel.getUserInfo(userId, (error1, userDataResponse) => {
                  groupDomain.getGroup(groupId)
                    .then((groupDataResponse) => {
                      fcmDomain.sendMessageToDeviceWithTokens(dTokens.tokens, {
                        notification: {
                          title: groupDataResponse.name || groupId,
                          body: `${userDataResponse.username || userId} bị mất kết nối!`,
                        },
                        data: {
                          group_id: JSON.stringify(groupId),
                          user_id: JSON.stringify(userId),
                          type: 'maps',
                        },
                      });
                    });
                });
              });
            });
          });
      });
    });
}

module.exports = groupLocation;
