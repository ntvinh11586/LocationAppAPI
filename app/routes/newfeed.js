const express = require('express');
const newfeedModel = require('../models/newfeed');

const router = express.Router();

router.get('/', (req, res) => {
  newfeedModel.getNewFeeds((err, data) => {
    res.json(data);
  });
});

router.get('/:id', (req, res) => {
  const newfeedId = req.params.id;
  newfeedModel.getNewFeed(newfeedId, (err, data) => {
    res.json(data);
  });
});

router.post('/', (req, res) => {
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
