const development = require('./development.json');

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    host: process.env.host || '',
    dbURI: process.env.dbURI,
    tokenSecretKey: process.env.tokenSecretKey,
    tokenExpired: process.env.tokenExpired,
    networkTimeout: process.env.networkTimeout,
  };
} else {
  module.exports = development;
}
