const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/:id', (req, res) => {
  const lng = req.body.lng;
  const lat = req.body.lat;
  const userId = req.params.id;

  db.UserModel.findById(userId, (err, user) => {
    if (err) {
      res.json({ err: 'err' });
    } else if (user == null) {
      res.json({ err: 'Cannot find users' });
    } else {
      user.latlng.lng = lng;
      user.latlng.lat = lat;
      user.save();
      res.json({ lat, lng });
    }
  });
});

router.get('/:id', (req, res) => {
  const userId = req.params.id;

  db.UserModel.findById(userId, (err, user) => {
    if (err) {
      res.json({ err: 'err' });
    } else if (user == null) {
      res.json({ err: 'Cannot find users' });
    } else {
      res.json(user.latlng);
    }
  });
});

module.exports = router;
