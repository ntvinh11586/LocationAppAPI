const express = require('express');
const newfeedModel = require('../models/newfeed');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated);

router.get('/', (req, res) => {
  newfeedModel.getNewFeeds((err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/', (req, res) => {
  const newsfeed = {
    title: req.body.title,
    image: req.body.image,
    description: req.body.description,
    location: req.body.location,
    rate: req.body.rate,
    date: req.body.date,
  };
  newfeedModel.createNewfeed(newsfeed, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/:newsfeed_id', (req, res) => {
  const newsfeedId = req.params.newsfeed_id;
  newfeedModel.getNewFeed(newsfeedId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
