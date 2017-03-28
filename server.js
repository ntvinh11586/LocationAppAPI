const express = require('express');
const passport = require('passport');
const locationAppAPI = require('./app');
const bodyParser = require('body-parser');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configure sessions
app.use(locationAppAPI.sessions);

// Configure passport.js
app.use(passport.initialize());
app.use(passport.session());

// routes' pointer
app.use('/', locationAppAPI.router);

locationAppAPI.ioServer(app).listen(app.get('port'), () => {
  console.log('LocationAppAPI is running on Port:', app.get('port'));
});
