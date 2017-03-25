'use strict';
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config');
const db = require('../db');

if (process.env.NODE_ENV === 'production') {
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db.Mongoose.connection
    })
  });
} else {
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    // dev mode: open store sessions for testing how session works.
    store: new MongoStore({
      mongooseConnection: db.Mongoose.connection
    })
    // Default dev mode:
    // http://stackoverflow.com/a/40396102/5557789
    // saveUninitialized: true
  });
}
