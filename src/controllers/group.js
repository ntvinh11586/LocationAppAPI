const express = require('express');
const groupModel = require('../models/group');

const router = express.Router();

router.post('/', (req, res) => {
  const groupName = req.body.group_name;
  const userId = req.body.user_id;
  groupModel.createGroup(userId, groupName, (err, data) => {
    res.json(data);
  });
});

router.get('/', (req, res) => {
  const userId = req.query.user_id;
  groupModel.getUserOwnGroups(userId, (err, data) => {
    res.json(data);
  });
});

router.post('/add_friend', (req, res) => {
  const groupId = req.body.group_id;
  const userId = req.body.user_id;
  const friendId = req.body.friend_id;
  groupModel.addFriendIntoGroup(groupId, userId, friendId, (err, data) => {
    res.json(data);
  });
});

router.get('/:id', (req, res) => {
  const groupId = req.params.id;
  groupModel.getUserOwnGroup(groupId, (err, data) => {
    res.json(data);
  });
});

module.exports = router;
