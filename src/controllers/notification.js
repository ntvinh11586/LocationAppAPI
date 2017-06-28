const express = require('express');
const authMiddleware = require('../middlewares/auth');
const subscriptionDomain = require('../domains/subscription');
const notificationDomain = require('../domains/notification');

const router = express.Router();

router.use(authMiddleware.isUserAuthenticated);

router.get('', (req, res) => {
  const { user_id: userId } = res.locals;
  notificationDomain.getNotifications(userId)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.post('', (req, res) => {
  const { user_id: userId } = res.locals;
  const { content, type } = req.body;
  notificationDomain.addNotification({ content, type, userId })
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
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
