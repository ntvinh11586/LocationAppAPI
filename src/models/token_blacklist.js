const TokenBlacklist = require('../caches/token_blacklist');

const tokenBlacklist = (new TokenBlacklist()).getInstance();

function hasToken(token) {
  return new Promise((resolve) => {
    const value = tokenBlacklist.get(JSON.stringify(token));
    resolve(value === true);
  });
}

function setToken(token) {
  return new Promise((resolve) => {
    tokenBlacklist.set(JSON.stringify(token), true, ((error, success) => {
      if (!error && success) {
        const value = tokenBlacklist.get(JSON.stringify(token));
        console.log('setToken', value === true);
        resolve(value === true);
      }
    }));
  });
}

module.exports = {
  setToken,
  hasToken,
};
