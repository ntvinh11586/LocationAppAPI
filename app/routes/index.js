'use strict';
const express = require("express");
const router = express.Router();

const renderRouter = require("./render");
const demoRouter = require("./demo");
const authRouter = require("./auth");

router.use('/', renderRouter);
router.use('/demo', demoRouter);
router.use('/auth', authRouter);

module.exports = router;
