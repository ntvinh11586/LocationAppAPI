const http = require('http');
const socketio = require('socket.io');
const router = require('./routes');
const socket = require('./sockets');

// Create an IO Server instance.
const ioServer = (app) => {
  // Set static variables in global.
  // app.locals.location = ?;

  // Configure server with Socket.io
  const server = http.Server(app);
  const io = socketio(server);
  socket(io);

  return server;
};

module.exports = {
  router,
  ioServer,
};
