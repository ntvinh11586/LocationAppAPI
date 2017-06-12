const admin = require('firebase-admin');

module.exports = {
  sendMessageToDeviceWithTokens: (tokens, payload) => {
    if (tokens === undefined || tokens.length === 0) {
      // Process the missing tokens
    } else {
      admin.messaging().sendToDevice(tokens, payload);
    }
  },
};
