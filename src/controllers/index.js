const express = require('express');
const demoRouter = require('./demo');
const authRouter = require('./auth');
const newfeedRouter = require('./newfeed');
const commentRouter = require('./comment');
const userRouter = require('./user');
const friendRouter = require('./friend');
const groupRouter = require('./group');
const tripPlanRouter = require('./trip_plan');
const chatRouter = require('./chat');
const gpsRouter = require('./gps');

const router = express.Router();

router.use('/demos', demoRouter);
router.use('/auths', authRouter);
router.use('/newsfeeds', newfeedRouter);
router.use('/newsfeeds/:newsfeed_id/comments', commentRouter);
router.use('/users', userRouter);
router.use('/friends', friendRouter);
router.use('/groups', groupRouter);
router.use('/groups/:group_id/trip_plan', tripPlanRouter);
router.use('/chats', chatRouter);
router.use('/geo', gpsRouter);

module.exports = router;
