const express = require('express');
const gpsModel = require('../models/gps');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated);

router.get('/', (req, res) => {
  const userId = req.headers.user_id;
  gpsModel.getPreviousLatlng(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/', (req, res) => {
  const userId = req.headers.user_id;
  const lng = req.body.lng;
  const lat = req.body.lat;
  gpsModel.createCurrentLatlng(userId, lat, lng, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.put('/', (req, res) => {
  const userId = req.headers.user_id;
  const lat = req.body.lat;
  const lng = req.body.lng;
  gpsModel.updateLatlng(userId, lat, lng, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.delete('/', (req, res) => {
  const userId = req.headers.user_id;
  gpsModel.deleteLatlng(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
