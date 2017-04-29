const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/get', (req, res) => {
  res.json({ name: 'demo', version: '2' });
});

router.post('/post', (req, res) => {
  res.json(req.body);
});

router.get('/get_user_id_with_authorization', (req, res) => {
  const token = req.query.token;
  jwt.verify(token, 'supersecret', (err, decoded) => {
    if (err) {
      res.json({ err: 'err' });
    } else {
      res.json({ _id: decoded._id });
    }
  });
});

module.exports = router;
