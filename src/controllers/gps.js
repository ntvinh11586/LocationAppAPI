const express = require('express');
const gpsModel = require('../models/gps');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated);

router.get('', (req, res) => {
  const { user_id: userId } = res.locals;
  gpsModel.getPreviousLatlng(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.post('', (req, res) => {
  const { user_id: userId } = res.locals;
  const { lat, lng } = req.body;
  gpsModel.createCurrentLatlng(userId, lat, lng, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.put('', (req, res) => {
  const { user_id: userId } = res.locals;
  const { lat, lng } = req.body;
  gpsModel.updateLatlng(userId, lat, lng, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.delete('', (req, res) => {
  const { user_id: userId } = res.locals;
  gpsModel.deleteLatlng(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
