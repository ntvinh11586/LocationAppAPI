const map = require('./map');
const groupChat = require('./group_chat');
const personalChat = require('./personal_chat');
const demo = require('./demo');

module.exports = (io) => {
  map(io);
  groupChat(io);
  demo(io);
  personalChat(io);
};
