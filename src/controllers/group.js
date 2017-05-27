const express = require('express');
const groupModel = require('../models/group');
const groupDomain = require('../domains/group');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated);

router.get('/', (req, res) => {
  const { user_id: userId } = res.locals;
  groupDomain.showMessageList(userId)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.post('/', (req, res) => {
  const userId = res.locals.user_id;
  const groupName = req.body.group_name;
  groupModel.createGroup(userId, groupName, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/:group_id', (req, res) => {
  const groupId = req.params.group_id;
  groupModel.getUserOwnGroup(groupId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/:group_id/members', (req, res) => {
  const userId = res.locals.user_id;
  const groupId = req.params.group_id;
  const friendId = req.query.friend_id;
  groupModel.addFriendIntoGroup(groupId, userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
