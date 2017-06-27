const createSingleton = require('create-singleton');
const redis = require('redis');

module.exports = createSingleton(function mySingleton() {
  const myPrivateVariable = redis.createClient('redis://redis-10039.c9.us-east-1-4.ec2.cloud.redislabs.com:10039/');
  this.getInstance = () => myPrivateVariable;
});
