const admin = require('firebase-admin');

module.exports = {
  sendMessageToDeviceWithTokens: (tokens, payload) =>
    admin.messaging().sendToDevice(tokens, payload),
};
