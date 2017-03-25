var express = require('express');
var router = express.Router();
var db = require('../db');

router.post('/', (req, res) => {
  console.log(req.query.id);
  db.newfeedModel.findById(req.query.id, (err, newfeed) => {
    if (err) {
      console.log(err);
      res.send('error');
    } else {
      var description = req.body.description;
      var comment = {
        description: description
      };
      db.commentModel.create(comment, (err, comment) => {
        if (err) {
          console.log(err);
          res.send('error');
        } else {
          // TODO: Implement author in here
          // comment.author.id = req.user._id;
          // comment.save();
          newfeed.comments.push(comment);
          newfeed.save();
          res.json(newfeed);
        }
      });
    }
  });
});

module.exports = router;
