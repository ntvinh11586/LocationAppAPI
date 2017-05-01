const express = require('express');
const commentModel = require('../models/comment');

const router = express.Router();

router.post('/', (req, res) => {
  const newfeedId = req.query.newfeed_id;
  const userId = req.query.user_id;
  const description = req.body.description;
  commentModel.createComment(newfeedId, userId, description, (err, json) => {
    res.json(json);
  });
});

module.exports = router;
