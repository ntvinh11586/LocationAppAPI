const TokenBlacklist = require('../caches/token_blacklist');

const tokenBlacklist = (new TokenBlacklist()).getInstance();

function hasToken(token) {
  return new Promise((resolve) => {
    tokenBlacklist.get(JSON.stringify(token), ((error, data) => {
      resolve(data === 'true');
    }));
  });
}

function setToken(token) {
  return new Promise((resolve) => {
    tokenBlacklist.set(JSON.stringify(token), true, ((error, success) => {
      if (!error && success) {
        console.log('setToken', token, true);
        resolve(true);
      }
    }));
  });
}

module.exports = {
  setToken,
  hasToken,
};
