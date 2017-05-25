const http = require('http');
const socketio = require('socket.io');
const router = require('./controllers');
const socket = require('./sockets');

const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

const registrationToken = 'dLceC4dXP5g:APA91bG0H2C4yVtZN-Qs8u2gcZI7Q2pExbwDrDrNHdF_LyblFk-Nu5H8Un0fjjguBEdgxOtjcRCIeW1J8IqpXI9NGtRvNYaNNqKeWq3Eq_l0ohtBoz3i6l4JlE2Zwrkp7N50kCrO-EVa';

const payload = {
  notification: {
    title: 'Demo FCM Title',
    body: 'Demo FCM Body',
  },
};

// Create an IO Server instance.
const ioServer = (app) => {
  // Configure server with Socket.io
  const server = http.Server(app);
  const io = socketio(server);
  socket(io);

  // Sample migrate fcm
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://friendlychat-99439.firebaseio.com/',
  });

  admin.messaging().sendToDevice(registrationToken, payload)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });

  return server;
};

module.exports = {
  router,
  ioServer,
};
