const groupLocation = require('./group_location');
const groupMessenger = require('./group_messenger');

module.exports = (io) => {
  groupLocation(io);
  groupMessenger(io);
};
