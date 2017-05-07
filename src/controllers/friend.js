const express = require('express');
const friendModel = require('../models/friend');

const router = express.Router();

router.get('/', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  friendModel.getFriendLists(userId, (err, data) => {
    res.json(data);
  });
});

router.get('/requests', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  friendModel.getFriendRequests(userId, (err, data) => {
    res.json(data);
  });
});

router.get('/pendings', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  friendModel.getFriendPendings(userId, (err, data) => {
    res.json(data);
  });
});

router.post('/:friend_id/add', (req, res) => {
  const token = req.headers.token;
  const userId = req.params.user_id;
  const acceptedFriendId = req.params.friend_id;
  friendModel.addFriend(userId, acceptedFriendId, (err, data) => {
    res.json(data);
  });
});

router.get('/:friend_id', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const friendId = req.params.friend_id;
  friendModel.getFriend(userId, friendId, (err, data) => {
    res.json(data);
  });
});

router.post('/:friend_id/accept', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const friendId = req.params.friend_id;
  friendModel.acceptFriend(userId, friendId, (err, data) => {
    res.json(data);
  });
});

router.delete('/:friend_id/unfriend', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const friendId = req.params.friend_id;
  friendModel.deleteFriend(userId, friendId, (err, data) => {
    res.json(data);
  });
});

module.exports = router;
