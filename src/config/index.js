const development = require('./development.json');

// We will seperate the production & development
// environment soon, but now we need to focus on
// deploying on the host.
// if (process.env.NODE_ENV === 'production') {
//   module.exports = {
//     host: process.env.host || '',
//     dbURI: process.env.dbURI,
//     tokenSecretKey: process.env.tokenSecretKey,
//     tokenExpired: process.env.tokenExpired,
//     networkTimeout: process.env.networkTimeout,
//   };
// } else {
//   module.exports = development;
// }

module.exports = development;
