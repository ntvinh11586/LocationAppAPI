const express = require('express');
const groupModel = require('../models/group');
const authMiddleware = require('../middlewares/auth');

// Merge parent params with their child
// https://expressjs.com/en/api.html
const router = express.Router({ mergeParams: true });
router.use(authMiddleware.isUserAuthenticated);

router.post('/', (req, res) => {
  const groupId = req.params.group_id;
  const startTime = req.body.start_time;
  const endTime = req.body.end_time;
  groupModel.setTripPlan(groupId, startTime, endTime, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.put('/', (req, res) => {
  const groupId = req.params.group_id;
  const startTime = req.body.start_time;
  const endTime = req.body.end_time;
  groupModel.updateTripPlan(groupId, startTime, endTime, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.delete('/', (req, res) => {
  const groupId = req.params.group_id;
  groupModel.deleteTripPlan(groupId, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
