const express = require('express');
const demoModel = require('../models/demo');

const router = express.Router();

router.get('/get', (req, res) => {
  demoModel.get((err, data) => {
    res.json(data);
  });
});

router.post('/post', (req, res) => {
  demoModel.post((err, data) => {
    res.json(data);
  });
});

router.get('/get_user_id_with_authorization', (req, res) => {
  const token = req.query.token;
  demoModel.getUserIdWithAuthorization(token, (err, data) => {
    res.json(data);
  });
});

module.exports = router;
