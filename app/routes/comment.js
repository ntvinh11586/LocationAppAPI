const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/', (req, res) => {
  db.newfeedModel.findById(req.query.newfeed_id, (err, newfeed) => {
    if (err) {
      res.send(err);
    } else {
      db.commentModel.create({ description: req.body.description }, (err, comment) => {
        if (err) {
          res.send('error');
        } else {
          comment.author._id = req.query.user_id; // user _id
          comment.save();
          newfeed.comments.push(comment);
          newfeed.save();
          res.json(newfeed);
        }
      });
    }
  });
});

module.exports = router;
