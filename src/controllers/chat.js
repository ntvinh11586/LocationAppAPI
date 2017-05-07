const express = require('express');
const groupModel = require('../models/group');

const router = express.Router();

router.post('/', (req, res) => {
  const userId = req.headers.user_id;
  const token = req.headers.token;
  const friendId = req.query.friend_id;
  groupModel.createPersonalChat(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/:friend_id', (req, res) => {
  const userId = req.headers.user_id;
  const token = req.headers.token;
  const friendId = req.params.friend_id;
  groupModel.getPersonalChat(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
