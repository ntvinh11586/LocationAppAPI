const http = require('http');
const socketio = require('socket.io');
const router = require('./controllers');
const socket = require('./sockets');

// Create an IO Server instance.
const ioServer = (app) => {
  // Configure server with Socket.io
  const server = http.Server(app);
  const io = socketio(server);
  socket(io);

  io.on('connection', (socket1) => {
    socket1.on('abc', (body) => {
      socket1.emit('abc_callback', body);
    });
  });

  return server;
};

module.exports = {
  router,
  ioServer,
};
