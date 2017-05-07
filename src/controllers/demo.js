const express = require('express');
const demoModel = require('../models/demo');

const router = express.Router();

router.get('/get', (req, res) => {
  demoModel.get((err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/post', (req, res) => {
  demoModel.post((err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/authorization', (req, res) => {
  const token = req.query.token;
  const user_id = req.headers.user_id;
  demoModel.authorization(token, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
