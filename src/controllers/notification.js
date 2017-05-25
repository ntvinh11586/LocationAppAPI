const express = require('express');
const authMiddleware = require('../middlewares/auth');
const subscriptionDomain = require('../domains/subscription');
const notificationDomain = require('../domains/notification');
const fcmDomain = require('../domains/fcm');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated);


const payload = {
  notification: {
    title: 'Demo FCM Title',
    body: 'Demo FCM Body',
  },
};

router.get('/', (req, res) => {
  const { group_id: groupId } = req.query;
  notificationDomain.notifyNewMessage(groupId, (err, data) => {
    fcmDomain.sendMessageToDeviceWithTokens(data.tokens, payload)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    res.json(data);
  });
});

router.post('/subscribe', (req, res) => {
  const { fcm_token: registrationToken } = req.body;
  const { user_id: userId } = res.locals;
  subscriptionDomain.subscribeDevice(userId, registrationToken)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.post('/unsubscribe', (req, res) => {
  const { fcm_token: registrationToken } = req.body;
  const { user_id: userId } = res.locals;
  subscriptionDomain.unsubscribeDevice(userId, registrationToken)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.prase(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

module.exports = router;
