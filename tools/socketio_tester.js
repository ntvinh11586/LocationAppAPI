const io = require('socket.io-client');

const BASE_URL = 'http://localhost:3000';
const NAMESPACE = 'chats/groups';
const URL = `${BASE_URL}/${NAMESPACE}`;

const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcl9pZCI6IjU5MjZiZmJjZjk3NjM3MzZhMDhmZDQ0ZSIsImlhdCI6MTQ5NTcxMTY3NiwiZXhwIjoxNTAwODk1Njc2fQ.3lDwP9-Hk5GjlDYvXKfw8s1XicTKSCP6TaZpWDRJWDQ';
const QUERY = '590bef9b8826232ed8f07aa9';

const EMIT = process.argv[2] || 'MISSING_EMIT';
const EMIT_CALLBACK = `${EMIT}_callback`;

// const requestData = {
//   group_id: '59149edb660d711ed0804652',
// };

const requestData = {
  group_id: "590bef9b8826232ed8f07aa9",
  user_id: "5926bfbcf9763736a08fd44e",
  chatter_id: "5926bfbcf9763736a08fd44e",
  content: "Message B",
  date: 1495720371389
};

const socket = io.connect(URL, {
  query: `group_id=${QUERY}`,
});

socket.on('connect', () => {
  console.log('EMIT', EMIT);
  console.log('EMIT_CALLBACK', EMIT_CALLBACK);

  socket
  .emit('authenticate', { token: USER_TOKEN })
  .on('authenticated', () => {
    console.log('authenticated!');
    console.log('why ooafsa');
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
