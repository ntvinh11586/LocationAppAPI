'use strict';
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

router.get('/:id', (req, res) => {
  var token = req.query.token;
  jwt.verify(token, 'supersecret', (err, decoded) => {
    if (err) {
      res.send(err);
    } else {
      var _id = req.params.id;
      db.userModel.findById(_id, (err, user) => {
        if (err) {
          res.send(err);
        } else {
          var user = {
            _id: user._id,
            username: user.username
          }
          res.json(user);
        }
      });
    }
  });
});

module.exports = router;
