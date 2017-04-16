const development = require('./development.json');

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    host: process.env.host || '',
    dbURI: process.env.dbURI,
  };
} else {
  module.exports = development;
}
