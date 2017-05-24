const express = require('express');
const friendModel = require('../models/friend');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated);

router.get('/friend', (req, res) => {
  const { user_id: userId } = res.locals;
  const { keyword } = req.query;
  friendModel.findFriends(userId, keyword)
    .then(data => res.json(data))
    .catch(error => res.status(error.status_code).send(error));
});

module.exports = router;
