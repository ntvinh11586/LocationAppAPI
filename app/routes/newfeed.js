var express = require("express");
var router = express.Router();
var db = require('../db');

router.get('/:id', (req, res) => {
  db.newfeedModel.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.json(foundCampground);
    }
  });
});

router.post('/', (req, res) => {
  var title = req.body.title;
  var image = req.body.image;
  var description = req.body.description;
  var location = req.body.location;
  var rate = req.body.rate;
  var newfeed = { title, image, description, location, rate };
  db.newfeedModel.create(newfeed, (err, newlyNewfeed) => {
    if (err) {
      console.log(err);
    }
    res.json(newlyNewfeed);
  });
});


module.exports = router;
