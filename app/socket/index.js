'use strict';
const h = require('../helpers');

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;
  let location = app.locals.location;

  // route: /locations - type: connection
  io.of('/locations').on('connection', socket => {
    // Usecase: get current location
    // on: getCurrentLocation -> emit: getLocation
    socket.on('getCurrentLocation', () => {
      socket.emit('getLocation', JSON.stringify(location));
    });

    socket.on('newLocation', newLocation => {
      location = { x: newLocation.x, y: newLocation.y };
      socket.emit('getLocation', JSON.stringify(location));
      socket.broadcast.emit('getLocation', JSON.stringify(location));
    });
  });

  // let allrooms = app.locals.chatrooms;
  // io.of('/roomslist').on('connection', socket => {
  //   socket.on('getChatrooms', () => {
  //     socket.emit('chatRoomsList', JSON.stringify(allrooms));
  //   });
  //
  //   socket.on('createNewRoom', newRoomInput => {
  //     // check to see if a room with the same title exists or not
  //     // if not, create one and boardcast it to everyone.
  //     if (!h.findRoomByname(allrooms, newRoomInput)) {
  //       // Create a new rooms and broadcast to allrooms
  //       allrooms.push({
  //         room: newRoomInput,
  //         roomID: h.randomHex(),
  //         users: []
  //       });
  //
  //       // Emit an updated list to the creator
  //       socket.emit('chatRoomsList', JSON.stringify(allrooms));
  //       // Emit an updated list to everyone connected to the rooms page
  //       socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
  //     }
  //   });
  // });
  //
  // io.of('/chatter').on('connection', socket => {
  //   // Join a chatroom
  //   console.log("fine");
  //
  //   socket.on('join', data => {
  //     let usersList = h.addUserToRoom(allrooms, data, socket);
  //
  //     // Update the list of active users as shown on the chatroom page
  //     socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
  //     socket.emit('updateUsersList', JSON.stringify(usersList.users));
  //   });
  //
  //   // When a socket exits
  //   socket.on('disconnect', () => {
  //     // Find the room, to which the socket is connect to and purge the user
  //     let room = h.removeUserFromRoom(allrooms, socket);
  //     socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
  //   });
  //
  //   // When a new message arrives
  //   socket.on('newMessage', data => {
  //     socket.broadcast.to(data.roomID).emit('inMessage', JSON.stringify(data));
  //   });
  // });
}
