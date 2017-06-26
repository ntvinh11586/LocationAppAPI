const http = require('http');
const socketio = require('socket.io');
const router = require('./controllers');
const socket = require('./sockets');

// Create an IO Server instance.
const ioServer = (app) => {
  // Configure server with Socket.io
  const server = http.Server(app);
  const io = socketio(server, {
    transports: ['websocket', 'flashsocket', 'polling'],
  });
  socket(io);

  return server;
};

module.exports = {
  router,
  ioServer,
};
