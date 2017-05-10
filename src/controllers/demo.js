const express = require('express');
const demoModel = require('../models/demo');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/get', (req, res) => {
  demoModel.get((err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/post', (req, res) => {
  demoModel.post((err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/authorization',
  authMiddleware.isUserAuthenticated,
  (req, res) => {
    res.json({
      status_code: 200,
      success: true,
      status_message: 'Valid token key.',
    });
  });

module.exports = router;
