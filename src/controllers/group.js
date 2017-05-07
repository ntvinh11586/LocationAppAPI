const express = require('express');
const groupModel = require('../models/group');

const router = express.Router();

router.get('/', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  groupModel.getUserOwnGroups(userId, (err, data) => {
    res.json(data);
  });
});

router.post('/', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const groupName = req.body.group_name;
  groupModel.createGroup(userId, groupName, (err, data) => {
    res.json(data);
  });
});

router.get('/:group_id', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const groupId = req.params.group_id;
  groupModel.getUserOwnGroup(groupId, (err, data) => {
    res.json(data);
  });
});

router.post('/:group_id/members', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const groupId = req.params.group_id;
  const friendId = req.query.friend_id;
  groupModel.addFriendIntoGroup(groupId, userId, friendId, (err, data) => {
    res.json(data);
  });
});

module.exports = router;
