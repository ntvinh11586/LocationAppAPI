const express = require('express');
const authModel = require('../models/auth');
const authMiddleware = require('../middlewares/auth');
const authDomain = require('../domains/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { username, password, phone, email, gender, birthday, city } = req.body;
  authDomain.registerUser({ username, password, phone, email, gender, birthday, city })
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
    }
  });
});

router.post('/login_with_token',
  authMiddleware.isUserAuthenticated,
  (req, res) => {
    const { username, user_id: userId } = res.locals;
    const { token } = req.headers;
    res.json({
      token,
      username,
      _id: userId,
    });
  });

router.get('/logout',
  authMiddleware.isUserAuthenticated,
  (req, res) => {
    authModel.logout((err, data) => {
      if (err) {
        res.status(data.status_code).send(data);
      } else {
        res.json(data);
      }
    });
  });

module.exports = router;
