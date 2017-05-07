const express = require('express');
const newfeedModel = require('../models/newfeed');

const router = express.Router();

router.get('/', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  newfeedModel.getNewFeeds((err, data) => {
    res.json(data);
  });
});

router.get('/:id', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const newsfeedId = req.params.newsfeed_id;
  newfeedModel.getNewFeed(newsfeedId, (err, data) => {
    res.json(data);
  });
});

router.post('/', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const newfeed = {
    title: req.body.title,
    image: req.body.image,
    description: req.body.description,
    location: req.body.location,
    rate: req.body.rate,
  };
  newfeedModel.createNewfeed(newfeed, (err, data) => {
    res.json(data);
  });
});

module.exports = router;
