const express = require('express');
const authModel = require('../models/auth');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  authModel.register(username, password, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
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
    const username = res.locals.username;
    const userId = res.locals.user_id;
    const token = req.headers.token;
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
        console.log('abc');
        res.status(data.status_code).send(data);
      } else {
        res.json(data);
      }
    });
  });

module.exports = router;
