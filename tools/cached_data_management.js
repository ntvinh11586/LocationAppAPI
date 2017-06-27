const redis = require('redis');

// User Cache Database
const client = redis.createClient('redis://redis-10039.c9.us-east-1-4.ec2.cloud.redislabs.com:10039/');

if (process.argv[2] === 'get_all') {
  client.keys('*', (err, keys) => {
    if (err) {
      return console.log(err);
    }
    for (let i = 0, len = keys.length; i < len; i += 1) {
      client.get(keys[i], (error, data) => {
        console.log('get_all', keys[i], data);
      });
    }
    return null;
  });
} else if (process.argv[2] === 'set') {
  client.set(process.argv[3] || '', process.argv[4], () => {
    client.get(process.argv[3] || '', (error, value) => {
      console.log('set', process.argv[3] || '', value);
    });
  });
} else if (process.argv[2] === 'get') {
  client.get(process.argv[3] || '', (error, value) => {
    console.log('get', process.argv[3] || '', value);
  });
} else if (process.argv[2] === 'delete') {
  client.del(process.argv[3] || '', (error, value) => {
    console.log('delete', process.argv[3] || '', value);
  });
} else if (process.argv[2] === 'delete_all') {
  client.flushdb((err, succeeded) => {
    console.log('delete_all', succeeded); // will be true if successfull
  });
}
