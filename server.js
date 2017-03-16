'use strict';
const express = require('express');
const app = express();
const locationAppAPI = require('./app');
const passport = require('passport');

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(locationAppAPI.sessions);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', locationAppAPI.router);

locationAppAPI.ioServer(app).listen(app.get('port'), () => {
    console.log('LocationAppAPI is running on Port:', app.get('port'));
});
