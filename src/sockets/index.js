const groupLocation = require('./group_location');
const groupMessenger = require('./group_messenger');
const personalMessenger = require('./personal_messenger');
const demo = require('./demo');

module.exports = (io) => {
  groupLocation(io);
  groupMessenger(io);
  demo(io);
  personalMessenger(io);
};
