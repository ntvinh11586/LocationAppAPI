const express = require('express');
const friendModel = require('../models/friend');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated);

router.get('/friends', (req, res) => {
  const { user_id: userId } = res.locals;
  const { keyword } = req.query;
  friendModel.findFriends(userId, keyword)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.get('/nearby_friends', (req, res) => {
  const { user_id: userId } = res.locals;
  friendModel.findNearbyFriends(userId)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

module.exports = router;
