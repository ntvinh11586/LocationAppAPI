const express = require('express');
const userModel = require('../models/user');
const authMiddleware = require('../middlewares/auth');
const userDomain = require('../domains/user');
const groupDomain = require('../domains/group');
const cacheDomain = require('../domains/cache');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated);

router.post('/avatar', (req, res) => {
  const { user_id: userId } = res.locals;
  const { avatar_url: avatarUrl } = req.body;
  userDomain.updateAvatar(userId, avatarUrl)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.get('/group_requests', (req, res) => {
  const { user_id: userId } = res.locals;
  userDomain.getGroupRequests(userId)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.post('/group_requests/:group_id/accept', (req, res) => {
  const { group_id: groupId } = req.params;
  const { user_id: userId } = res.locals;
  userDomain.acceptGroupRequest({ groupId, userId })
    .then(data => res.json(data))
    .then(() => cacheDomain.loadUserInfoFromDatabase({ userId }))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.delete('/group_requests/:group_id/delete', (req, res) => {
  const { group_id: groupId } = req.params;
  const { user_id: userId } = res.locals;
  userDomain.declineGroupRequest({ groupId, userId })
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.get('/:user_id', (req, res) => {
  const userId = req.params.user_id;
  userModel.getUserInfo(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/:user_id/chat', (req, res) => {
  const { user_id: friendId } = req.params;
  const { user_id: userId } = res.locals;
  groupDomain.createNewTwoPersonsGroup(userId, friendId)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

module.exports = router;
