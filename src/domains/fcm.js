const admin = require('firebase-admin');

module.exports = {
  sendMessageToDeviceWithTokens: (tokens, payload) => {
    if (tokens === undefined || tokens.length === 0) {
      // Process the missing tokens
    } else {
      // Temporary solutions for unique token fcmDomain
      const uniqueTokens = tokens.filter((x, i, a) => a.indexOf(x).equals(i));
      admin.messaging().sendToDevice(uniqueTokens, payload);
    }
  },
};
