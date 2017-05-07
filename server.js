/* eslint-disable no-unused-vars */

const config = require('./src/config');
const express = require('express');
const locationAppAPI = require('./src');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// Another way to handle 404
// http://stackoverflow.com/a/9802006/5557789
app.use((req, res, next) => {
  res.status(404);
  // respond with json
  if (req.accepts('json')) {
    res.status(404).json({ error: 'Not found error - 404' });
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ err: 'Internal error - 500' });
});

// Fix deprecation warning mpromise
// by using the default promise of Node.js.
// https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
mongoose.connect(config.dbURI);

// Log an error if the connection fails
mongoose.connection.on('error', (error) => {
  console.log('MongoDB Error: ', error);
});

locationAppAPI.ioServer(app).listen(app.get('port'), () => {
  console.log('LocationAppAPI is running on Port:', app.get('port'));
});
