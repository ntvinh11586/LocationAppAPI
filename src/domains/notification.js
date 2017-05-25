const userModel = require('../models/user');

module.exports = {
  subscribeDevice: (userId, registrationToken) =>
    userModel.addDevice(userId, {
      token: registrationToken,
      date: (new Date()).getTime(),
    }),

  unsubscribeDevice: (userId, registrationToken) =>
    userModel.removeDevice(userId, {
      token: registrationToken,
    }),
};
