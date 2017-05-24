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
    .catch(error => res.status(error.status_code).send(error));
});

router.get('/nearby_friends', (req, res) => {
  const { user_id: userId } = res.locals;
  friendModel.findNearbyFriends(userId)
    .then(data => res.json(data))
    .catch(() => {
      // TODO: need to process
      res.send('lol');
    });
});

module.exports = router;
