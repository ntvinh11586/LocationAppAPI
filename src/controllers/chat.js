const express = require('express');
const groupModel = require('../models/group');

const router = express.Router();

router.post('/', (req, res) => {
  const userId = req.body.user_id;
  const friendId = req.body.friend_id;
  groupModel.createPersonalChat(userId, friendId, (err, data) => {
    res.json(data);
  });
});

router.get('/:id', (req, res) => {
  const userId = req.params.id;
  const friendId = req.query.friend_id;
  groupModel.getPersonalChat(userId, friendId, (err, data) => {
    res.json(data);
  });
});

module.exports = router;
