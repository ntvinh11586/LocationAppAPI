const express = require('express');
const authModel = require('../models/auth');
const authMiddleware = require('../middlewares/auth');
const authDomain = require('../domains/auth');
const cacheDomain = require('../domains/cache');
const tokenExpiredDomain = require('../domains/token_expired');
const userModel = require('../models/user');

const router = express.Router();

router.post('/register', (req, res) => {
  const { username, fullname, password, phone, email, gender, birthday, city } = req.body;
  authDomain.registerUser({ username, fullname, password, phone, email, gender, birthday, city })
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  authModel.login(username, password, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);

      cacheDomain.loadUserInfoFromDatabase({
        userId: data.user_id,
      });
    }
  });
});

router.post('/login_with_token',
  authMiddleware.isUserAuthenticated,
  (req, res) => {
    const { user_id: userId } = res.locals;
    const { token } = req.headers;
    userModel.getUserInfo(userId, (error, data) => {
      res.json({
        user_id: userId,
        username: data.username,
        user_token: token,
        fullname: data.fullname,
        phone: data.phone,
        email: data.email,
        gender: data.gender,
        birthday: data.birthday,
        token,
        _id: userId,
      });
      cacheDomain.loadUserInfoFromDatabase({ userId });
    });
  });

router.get('/logout',
  authMiddleware.isUserAuthenticated,
  (req, res) => {
    const { user_id: userId, token } = res.locals;
    authModel.logout((err, data) => {
      if (err) {
        res.status(data.status_code).send(data);
      } else {
        res.json(data);
        cacheDomain.deleteUserInfo({ userId });
        tokenExpiredDomain.expireToken(token);
      }
    });
  });

module.exports = router;
