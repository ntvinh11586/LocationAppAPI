'use strict';
const express = require('express');
const app = express();
const travelAppAPI = require('./app');
const passport = require('passport');

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
// app.set('views', './views'); // views = ./views
app.set('view engine', 'ejs');

app.use(travelAppAPI.sessions);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', travelAppAPI.router);

travelAppAPI.ioServer(app).listen(app.get('port'), () => {
  console.log('travelAppAPI is running on Port: ', app.get('port'));
});
