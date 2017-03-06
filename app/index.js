'use strict';
const router = require('express').Router();

// Social Authentication Logic
require('./auth')();

// Create an IO Server instance
let ioServer = app => {
  app.locals.chatrooms = [];
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  // 062 Socket.io - Bridging Socket.io with Session
  io.use((socket, next) => {
    require('./session')(socket.request, {}, next);
  });
  require('./socket')(io, app);
  return server;
}

module.exports = {
  router: require('./routes')(),
  sessions: require('./session'),
  ioServer
}
