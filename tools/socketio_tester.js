const io = require('socket.io-client');

const BASE_URL = 'http://localhost:3000';
const NAMESPACE = 'maps';
const URL = BASE_URL + '/' + NAMESPACE;

const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpbmg5ODciLCJ1c2VyX2lkIjoiNThkNzE4NzdmNjc3OTkxZmUwYmY1NzRmIiwiaWF0IjoxNDk1MzY1NDQwLCJleHAiOjE1MDA1NDk0NDB9.7xTULmRflMqKhqgc12KpZjPmyAxTA0HA2ViMQ-hz8DU';
const QUERY = '59149edb660d711ed0804652';

const EMIT = 'get_latlngs';
const EMIT_CALLBACK = 'get_latlngs_callback';

const requestData = {
  group_id: '59149edb660d711ed0804652',
};

const socket = io.connect(URL, {
  query: 'group_id=' + QUERY,
});

socket.on('connect', () => {
  socket
  .emit('authenticate', { token: USER_TOKEN })
  .on('authenticated', () => {
    console.log('authenticated!');
  })
  .on('unauthorized', (msg) => {
    console.log('unauthorized!', msg);
  })
  .emit(EMIT, JSON.stringify((requestData)))
  .on(EMIT_CALLBACK, (data) => {
    console.log(data);
  })
  .on('error', (data) => {
    console.log(data);
  });
});
