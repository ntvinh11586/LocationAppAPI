'use strict';
const express = require("express");
const router = express.Router();

const renderRouter = require("./render");
const demoRouter = require("./demo");
const authRouter = require("./auth");
const newfeedRouter = require("./newfeed");

router.use('/', renderRouter);
router.use('/demo', demoRouter);
router.use('/auth', authRouter);
router.use('/newfeed', newfeedRouter);

module.exports = router;
