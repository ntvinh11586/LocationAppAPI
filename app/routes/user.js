'use strict';
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

router.get('/info', (req, res) => {
  var token = req.query.token;
  console.log(token);
  jwt.verify(token, 'supersecret', (err, decoded) => {
    if (err) {
      res.send(err);
    } else {
      var _id = req.query._id;
      console.log(_id);
      db.userModel.findById(_id, (err, user) => {
        if (err) {
          res.send(err);
        } else {
          var user = {
            username: user.username
          }
          res.json(user);
        }
      });
    }
  });
});

module.exports = router;
