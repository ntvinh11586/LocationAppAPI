const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/get', (req, res) => {
  console.log('demo GET method for /get');
  res.json({ name: 'demo', version: '2' });
});

router.post('/post', (req, res) => {
  console.log('demo POST method for /post');
  res.json(req.body);
});

router.get('/get_local_auth', (req, res) => {
  const token = req.query.token;
  jwt.verify(token, 'supersecret', (err, decoded) => {
    if (err) {
      res.send(err);
    } else {
      res.send(decoded._id);
    }
  });
});

module.exports = router;
