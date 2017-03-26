'use strict';
const express = require("express");
const router = express.Router();
const h = require('../helpers');
const config = require('../config');

router.get('/', (req, res, next) => {
  res.send('Welcome');
});

router.get('/location_one_user', (req, res) => {
  res.render('location_one_user', {
    host: config.host
  });
});

module.exports = router;
