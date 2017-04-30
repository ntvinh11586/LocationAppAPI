const express = require('express');
const userModel = require('../models/user');

const router = express.Router();

router.get('/:id', (req, res) => {
  const userId = req.params.id;
  const token = req.query.token;
  userModel.getUserInfo(userId, token, (err, data) => {
    res.json(data);
  });
});

module.exports = router;
