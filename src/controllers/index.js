const express = require('express');
const demoRouter = require('./demo');
const authRouter = require('./auth');
const userRouter = require('./user');
const friendRouter = require('./friend');
const groupRouter = require('./group');
const tripPlanRouter = require('./trip_plan');
const chatRouter = require('./chat');
const gpsRouter = require('./gps');
const searchRouter = require('./search');
const notificationRouter = require('./notification');

const router = express.Router();

router.use('/demo', demoRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/users/:user_id/chat', chatRouter);
router.use('/friends', friendRouter);
router.use('/groups', groupRouter);
router.use('/groups/:group_id/trip_plan', tripPlanRouter);
router.use('/gps', gpsRouter);
router.use('/search', searchRouter);
router.use('/notification', notificationRouter);

module.exports = router;
