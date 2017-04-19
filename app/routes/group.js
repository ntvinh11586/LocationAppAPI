const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/', (req, res) => {
  const groupName = req.body.group_name;
  const userId = req.body.user_id;

  db.GroupModel.findOne({ name: groupName }, (err, group) => {
    if (group != null) {
      res.json({ err: 'Already have group' });
    } else {
      db.GroupModel.create({ name: groupName }, (err, newGroup) => {
        db.UserModel.findById(userId, (err, user) => {
          console.log(user);
          newGroup.users.push(user);
          newGroup.save();
          res.json(newGroup);
        });
      });
    }
  });
});

router.get('/', (req, res) => {
  const userId = req.query.user_id;

  db.GroupModel.find({ users: userId }, (err, group) => {
    if (group == null) {
      res.json({ err: 'Cannot find any groups' });
    } else {
      res.json(group);
    }
  });
});

router.post('/add_friend', (req, res) => {
  const userId = req.body.user_id;
  const friendId = req.body.friend_id;

  db.GroupModel.findOne({ users: userId }, (err, group) => {
    db.UserModel.findOne({ _id: friendId }, (err, friendUser) => {
      group.users.push(friendUser);
      group.save();
      res.json(group);
    });
  });
});

router.get('/:id', (req, res) => {
  const groupId = req.params.id;

  db.GroupModel.findOne({ _id: groupId }, (err, group) => {
    if (group == null) {
      res.json({ err: 'err' });
    } else {
      res.json(group);
    }
  });
});

module.exports = router;
