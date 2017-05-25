const map = require('./map');
const chat = require('./chat');
const demo = require('./demo');

module.exports = (io) => {
  const chatNamespace = io.of('/chats');
  const mapNamespace = io.of('/maps');

  chat(chatNamespace);
  demo(io);
  map(mapNamespace);
};
