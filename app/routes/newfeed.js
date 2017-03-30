const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/:id', (req, res) => {
  db.newfeedModel.findById(req.params.id).populate('comments').exec((err, newfeed) => {
    if (err) {
      console.log(err);
    } else {
      res.json(newfeed);
    }
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
  db.newfeedModel.create(newfeed, (err, newlyNewfeed) => {
    if (err) {
      console.log(err);
    }
    res.json(newlyNewfeed);
  });
});

module.exports = router;
