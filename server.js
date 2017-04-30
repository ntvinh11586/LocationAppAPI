const config = require('./app/config');
const express = require('express');
const locationAppAPI = require('./app');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// routes' pointer
app.use('/', locationAppAPI.router);

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
