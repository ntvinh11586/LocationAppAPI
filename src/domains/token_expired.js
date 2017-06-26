const tokenBlacklist = require('../models/token_blacklist');

module.exports = {
  expireToken: token => tokenBlacklist.setToken(token),
};
