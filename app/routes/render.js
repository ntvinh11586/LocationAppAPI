'use strict';
const express = require("express");
const router = express.Router();
const h = require('../helpers');
const config = require('../config');

router.get('/', (req, res, next) => {
  res.render('login');
});

router.get('/locations', h.isAuthenticated, (req, res, next) => {
  res.render('locations', {
    user: req.user,
    host: config.host
  });
});

module.exports = router;
