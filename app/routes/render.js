'use strict';
const express = require("express");
const router = express.Router();
const h = require('../helpers');
const config = require('../config');

router.get('/', (req, res, next) => {
  console.log(req.session);
  res.render('login');
});

router.get('/locations', h.isAuthenticated, (req, res, next) => {
  console.log(req.session);
  res.render('locations', {
    user: req.user,
    host: config.host
  });
});

module.exports = router;
