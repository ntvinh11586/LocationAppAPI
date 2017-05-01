const express = require('express');
const friendModel = require('../models/friend');

const router = express.Router();

router.post('/accept_friend/:id', (req, res) => {
  const userId = req.params.id;
  const acceptedFriendId = req.query.user_id;
  friendModel.acceptFriend(userId, acceptedFriendId, (err, data) => {
    res.json(data);
  });
});

router.post('/add_friend/:id', (req, res) => {
  const userId = req.params.id;
  const acceptedFriendId = req.query.user_id;
  friendModel.addFriend(userId, acceptedFriendId, (err, data) => {
    res.json(data);
  });
});

router.get('/friend_list/:id', (req, res) => {
  const userId = req.params.id;
  friendModel.getFriendLists(userId, (err, data) => {
    res.json(data);
  });
});

router.get('/friend_requests/:id', (req, res) => {
  const userId = req.params.id;
  friendModel.getFriendRequests(userId, (err, data) => {
    res.json(data);
  });
});

router.delete('/:friend_id', (req, res) => {
  const userId = req.headers.user_id;
  const friendId = req.params.friend_id;
  friendModel.deleteFriend(userId, friendId, (err, data) => {
    res.json(data);
  });
});

router.get('/pendings', (req, res) => {
  const userId = req.headers.user_id;
  friendModel.getFriendPendings(userId, (err, data) => {
    res.json(data);
  });
});

router.get('/:friend_id', (req, res) => {
  const userId = req.headers.user_id;
  const friendId = req.params.friend_id;
  console.log('lala');
  friendModel.getFriend(userId, friendId, (err, data) => {
    res.json(data);
  });
});

module.exports = router;
