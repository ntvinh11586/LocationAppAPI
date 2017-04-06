const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

router.get('/:id', (req, res) => {
  const token = req.query.token;
  jwt.verify(token, 'supersecret', (err, decoded) => {
    if (err) {
      res.send(err);
    } else {
      const _id = req.params.id;
      db.UserModel.findById(_id, (err, user) => {
        if (err) {
          res.send(err);
        } else {
          res.json({ _id: user._id, username: user.username });
        }
      });
    }
  });
});

module.exports = router;
