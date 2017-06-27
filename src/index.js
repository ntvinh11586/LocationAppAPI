const http = require('http');
const socketio = require('socket.io');
const router = require('./controllers');
const socket = require('./sockets');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');

// Create an IO Server instance.
const ioServer = (app) => {
  // Configure server with Socket.io
  const server = http.Server(app);
  const io = socketio(server);
  const pubClient = redis(12471, 'pub-redis-12471.ap-northeast-1-2.1.ec2.garantiadata.com', {});
  const subClient = redis(12471, 'pub-redis-12471.ap-northeast-1-2.1.ec2.garantiadata.com', {
    return_buffers: true,
  });
  io.adapter(adapter({
    pubClient,
    subClient,
  }));
  socket(io);

  return server;
};

module.exports = {
  router,
  ioServer,
};
