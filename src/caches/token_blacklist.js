const createSingleton = require('create-singleton');
const redis = require('redis');

module.exports = createSingleton(function mySingleton() {
  const myPrivateVariable = redis.createClient('redis://pub-redis-10388.ap-northeast-1-2.1.ec2.garantiadata.com:10388/');
  this.getInstance = () => myPrivateVariable;
});
