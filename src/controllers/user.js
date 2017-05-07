const express = require('express');
const userModel = require('../models/user');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated());

router.get('/:user_id', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  userModel.getUserInfo(userId, token, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
