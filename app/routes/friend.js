const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/accept_friend/:id', (req, res) => {
  db.UserModel.findById(req.params.id, (err, user) => {
    if (err) {
      res.json({ err: 'error' });
    }
    if (user.friend_requests.some(x => x.equals(req.query.user_id))) {
      db.UserModel.findById(req.query.user_id, (err, friend) => {
        if (err) {
          res.json({ err: 'error' });
        }
        // add friend
        user.friends.push(friend);
        friend.friends.push(user);
        // remove friend request
        user.friend_requests.pull(friend._id);
        // remove friend pending
        friend.friends_pending.pull(user._id);
        // save change
        user.save();
        friend.save();
        res.json({
          _id: friend._id,
          username: friend.username,
        });
      });
    } else {
      res.json({ err: 'error' });
    }
  });
});

router.post('/add_friend/:id', (req, res) => {
  db.UserModel.findById(req.params.id, (err, user) => {
    if (err) {
      res.json({ err: 'error' });
    } else if (user.friends.some(x => x.equals(req.query.user_id))) {
      res.json({ err: 'already friend' });
    } else {
      db.UserModel.findById(req.query.user_id, (err, requestedFriend) => {
        if (err) {
          res.json({ err: 'error' });
        }
        user.friends_pending.push(requestedFriend);
        user.save();
        requestedFriend.friend_requests.push(user);
        requestedFriend.save();
        res.json({
          _id: requestedFriend._id,
          username: requestedFriend.username,
        });
      });
    }
  });
});

router.get('/friend_list/:id', (req, res) => {
  db.UserModel.findById(req.params.id).populate('users').exec((err, user) => {
    res.json({ friend_list: user.friends });
  });
});

router.get('/friend_requests/:id', (req, res) => {
  db.UserModel.findById(req.params.id).populate('users').exec((err, user) => {
    res.json({ friend_requests: user.friend_requests });
  });
});

module.exports = router;
