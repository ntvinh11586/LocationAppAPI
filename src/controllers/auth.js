const express = require('express');
const authModel = require('../models/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  authModel.register(username, password, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
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
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/logout', (req, res) => {
  const userId = req.headers.user_id;
  const token = req.headers.token;
  authModel.logout((err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
