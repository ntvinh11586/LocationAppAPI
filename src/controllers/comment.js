const express = require('express');
const commentModel = require('../models/comment');
const authMiddleware = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });
router.use(authMiddleware.isUserAuthenticated);

router.post('/', (req, res) => {
  const userId = res.locals.user_id;
  const newsfeedId = req.params.newsfeed_id;
  const description = req.body.description;
  commentModel.createComment(newsfeedId, userId, description, (err, data) => {
    if (err) {
      res.status(data.status_code).json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
