'use strict';
const h = require('../helpers');

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;
  let location = app.locals.location;

  // Route: /locations - Type namespace: connection
  io.of('/locations').on('connection', socket => {
    // Usecase: Get current location.
    // on: getCurrentLocation -> emit: getLocation
    socket.on('getCurrentLocation', () => {
      socket.emit('getLocation', JSON.stringify(location));
    });
    // Usecase: Create new location and broadcast.
    // on: getCurrentLocation -> emit: getLocation
    socket.on('newLocation', newLocation => {
      location = newLocation;
      socket.emit('getLocation', JSON.stringify(location));
      socket.broadcast.emit('getLocation', JSON.stringify(location));
    });
  });
}
