function demoSocket(io) {
  io.of('/demo').on('connection', (socket) => {
    socket.on('post_something', (data) => {
      const json = JSON.parse(data);
      socket.emit('post_something_callback', json);
    });

    socket.on('get_something', () => {
      const json = { text: 'Get something from socket' };
      socket.emit('get_something_callback', json);
    });

    socket.on('post_and_broadcast_something', (data) => {
      const json = JSON.parse(data);
      socket.emit('post_and_broadcast_something_callback', json);
    });
  });
}

module.exports = demoSocket;
