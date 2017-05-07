const express = require('express');
const commentModel = require('../models/comment');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res) => {
  const userId = req.headers.user_id;
  const token = req.headers.token;
  const newsfeedId = req.params.newsfeed_id;
  const description = req.body.description;
  commentModel.createComment(newsfeedId, userId, description, (err, json) => {
    res.json(json);
  });
});

module.exports = router;
