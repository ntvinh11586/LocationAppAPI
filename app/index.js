const http = require('http');
const socketio = require('socket.io');
const sessions = require('./session');
const router = require('./routes');
const socket = require('./socket');

// Social Authentication Logic
require('./auth')();

// Create an IO Server instance
const ioServer = (app) => {
  // set static variables in global
  // app.locals.location = null;

  const server = http.Server(app);
  const io = socketio(server);

  // Add sessions for Socket.io
  // http://stackoverflow.com/a/25618636/5557789
  io.use((socketReq, next) => {
    sessions(socketReq.request, {}, next);
  });
  socket(io, app);

  return server;
};

module.exports = {
  router,
  sessions,
  ioServer,
};
