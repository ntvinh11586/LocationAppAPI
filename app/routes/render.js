'use strict';
const express = require("express");
const router = express.Router();
const h = require('../helpers');
const config = require('../config');

router.get('/', (req, res, next) => {
  res.send('Welcome');
});

module.exports = router;
