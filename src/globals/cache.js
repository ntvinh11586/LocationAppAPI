const createSingleton = require('create-singleton');
const NodeCache = require('node-cache');

module.exports = createSingleton(function mySingleton() {
  const myPrivateVariable = new NodeCache();
  this.getInstance = () => myPrivateVariable;
});
