const http = require('http');
const socketio = require('socket.io');
const router = require('./routes');
const socket = require('./socket');

// Create an IO Server instance
const ioServer = (app) => {
  // set static variables in global
  // app.locals.location = ?;
  const server = http.Server(app);
  const io = socketio(server);
  socket(io, app);

  return server;
};

module.exports = {
  router,
  ioServer,
};
