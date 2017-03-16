'use strict';
const router = require('express').Router();

// Social Authentication Logic
require('./auth')();

// Create an IO Server instance
let ioServer = app => {
  // set static variables in global
  app.locals.location = null;

  const server = require('http').Server(app);
  const io = require('socket.io')(server);

  // add sessions
  // http://stackoverflow.com/a/25618636/5557789
  io.use((socket, next) => {
    console.log(socket.request);
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
