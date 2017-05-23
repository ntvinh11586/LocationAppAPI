const map = require('./map');
const chat = require('./chat');
const demo = require('./demo');

module.exports = (io) => {
  map(io);
  chat(io);
  demo(io);
};
