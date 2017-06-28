const io = require('socket.io-client');

const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://stormy-woodland-18039.herokuapp.com';
const NAMESPACE = 'chats';
const URL = `${BASE_URL}/${NAMESPACE}`;

const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcl9pZCI6IjU5MjZiZmJjZjk3NjM3MzZhMDhmZDQ0ZSIsImlhdCI6MTQ5NTcxMTY3NiwiZXhwIjoxNTAwODk1Njc2fQ.3lDwP9-Hk5GjlDYvXKfw8s1XicTKSCP6TaZpWDRJWDQ';
const QUERY = '59523c41c3f56a191cad8c26';

const EMIT = process.argv[2] || 'MISSING_EMIT';
const EMIT_CALLBACK = `${EMIT}_callback`;

const requestData = require('./request_data.json');

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
    console.log(requestData);
    let count = 0;
    let total = 0;

    // setInterval(() => {
    //   let start = (new Date()).getTime();
    //   socket
    //     .emit(EMIT, JSON.stringify((requestData)))
    //     .on(EMIT_CALLBACK, (data) => {
    //       console.log(data);
    //       const end = (new Date()).getTime();
    //       total += end - start;
    //       console.log(`RESPONSE TIME ${end - start}ms`);
    //       start = end;
    //       count += 1;
    //       console.log(`AVERAGE TIME ${total / count}ms`);
    //     });
    // }, 1000 / 60);

    socket
      .emit(EMIT, JSON.stringify((requestData)))
      .on(EMIT_CALLBACK, (data) => {
        console.log(data);
        // console.log(`RESPONSE TIME ${(new Date()).getTime() - start}ms`);
      });
  })
  .on('unauthorized', (msg) => {
    console.log('unauthorized!', msg);
  })
  .on('error', (data) => {
    console.log(data);
  });
});
