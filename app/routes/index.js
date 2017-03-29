const express = require('express');
const renderRouter = require('./render');
const demoRouter = require('./demo');
const authRouter = require('./auth');
const newfeedRouter = require('./newfeed');
const commentRouter = require('./comment');
const userRouter = require('./user');

const router = express.Router();

router.use('/', renderRouter);
router.use('/demo', demoRouter);
router.use('/auth', authRouter);
router.use('/newfeed', newfeedRouter);
router.use('/comment', commentRouter);
router.use('/user', userRouter);

module.exports = router;
