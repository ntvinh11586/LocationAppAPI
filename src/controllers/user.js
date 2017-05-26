const express = require('express');
const userModel = require('../models/user');
const authMiddleware = require('../middlewares/auth');
const userDomain = require('../domains/user');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated);

router.get('/:user_id', (req, res) => {
  const userId = res.locals.user_id;
  userModel.getUserInfo(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/avatar', (req, res) => {
  const { user_id: userId } = res.locals;
  const { avatar_url: avatarUrl } = req.body;
  userDomain.updateAvatar(userId, avatarUrl)
    .then(data => res.json(data))
    .then((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

module.exports = router;
