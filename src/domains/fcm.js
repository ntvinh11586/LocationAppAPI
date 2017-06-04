const admin = require('firebase-admin');

module.exports = {
  sendMessageToDeviceWithTokens: (tokens, payload) => {
    if (tokens === undefined || tokens.length === 0) {
      admin.messaging().sendToDevice(tokens, payload);
    }
  },
};
