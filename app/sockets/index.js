const groupLocation = require('./group_location');
const groupMessenger = require('./group_messenger');
const demo = require('./demo');

module.exports = (io) => {
  groupLocation(io);
  groupMessenger(io);
  demo(io);
};
