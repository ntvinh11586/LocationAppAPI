'use strict';
const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require("body-parser");

const locationAppAPI = require('./app');
const renderRouter = require("./app/routes/render");
const demoRouter = require("./app/routes/demo");
const authRouter = require("./app/routes/auth");

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(locationAppAPI.sessions);
app.use(passport.initialize());
app.use(passport.session());

// app.use('/', locationAppAPI.router);
app.use('/', renderRouter);
app.use('/demo', demoRouter);
app.use('/auth', authRouter);

locationAppAPI.ioServer(app).listen(app.get('port'), () => {
    console.log('LocationAppAPI is running on Port:', app.get('port'));
});
