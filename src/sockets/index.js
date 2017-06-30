const map = require('./map');
const chat = require('./chat');
const demo = require('./demo');
const notification = require('./notification');

module.exports = (io) => {
  const chatNamespace = io.of('/chats');
  const mapNamespace = io.of('/maps');
  const notificationNamespace = io.of('/notifications');

  demo(io);
  chat(chatNamespace);
  map(mapNamespace);
  notification(notificationNamespace);
};
