const express = require('express');
const friendModel = require('../models/friend');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated());

router.get('/', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  friendModel.getFriendLists(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/requests', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  friendModel.getFriendRequests(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/pendings', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  friendModel.getFriendPendings(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/:friend_id/add', (req, res) => {
  const token = req.headers.token;
  const userId = req.params.user_id;
  const acceptedFriendId = req.params.friend_id;
  friendModel.addFriend(userId, acceptedFriendId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/:friend_id', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const friendId = req.params.friend_id;
  friendModel.getFriend(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/:friend_id/accept', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const friendId = req.params.friend_id;
  friendModel.acceptFriend(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.delete('/:friend_id/unfriend', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const friendId = req.params.friend_id;
  friendModel.deleteFriend(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
