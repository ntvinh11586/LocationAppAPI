'use strict';
const router = require('express').Router();

// Social Authentication Logic
require('./auth')();

module.exports = {
  router: require('./routes')(),
  sessions: require('./session')
}
