const express = require('express');
const groupModel = require('../models/group');
const authMiddleware = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });
router.use(authMiddleware.isUserAuthenticated);

router.get('/', (req, res) => {
  const userId = req.headers.user_id;
  const friendId = req.params.user_id;
  groupModel.getPersonalChat(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/', (req, res) => {
  const userId = req.headers.user_id;
  const friendId = req.params.user_id;
  groupModel.createPersonalChat(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
