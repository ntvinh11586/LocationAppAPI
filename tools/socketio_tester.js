const io = require('socket.io-client');

// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://stormy-woodland-18039.herokuapp.com';
const NAMESPACE = 'chats';
const URL = `${BASE_URL}/${NAMESPACE}`;

const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcl9pZCI6IjU5MjZiZmJjZjk3NjM3MzZhMDhmZDQ0ZSIsImlhdCI6MTQ5NTcxMTY3NiwiZXhwIjoxNTAwODk1Njc2fQ.3lDwP9-Hk5GjlDYvXKfw8s1XicTKSCP6TaZpWDRJWDQ';
const QUERY = '594fe500d82fc300113f7280';

const EMIT = process.argv[2] || 'MISSING_EMIT';
const EMIT_CALLBACK = `${EMIT}_callback`;

const requestData = require('./request_data.json');

const socket = io.connect(BASE_URL, {
  path: NAMESPACE,
  query: `group_id=${QUERY}`,
});
console.log(URL);
socket.on('connect', () => {
  console.log('EMIT', EMIT);
  console.log('EMIT_CALLBACK', EMIT_CALLBACK);
  console.log(URL);
  socket
  .emit('authenticate', { token: USER_TOKEN })
  .on('authenticated', () => {
    console.log('authenticated!');
    console.log(requestData);
    socket
      .emit(EMIT, JSON.stringify((requestData)))
      .on(EMIT_CALLBACK, (data) => {
        console.log(data);
      });
  })
  .on('unauthorized', (msg) => {
    console.log('unauthorized!', msg);
  })
  .on('error', (data) => {
    console.log(data);
  });
});
