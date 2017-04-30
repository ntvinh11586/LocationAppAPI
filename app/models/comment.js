const db = require('../db');

function createComment(newfeedId, userId, description, callback) {
  db.NewfeedRepository.findById(newfeedId, (err, newfeed) => {
    if (err) {
      callback(err, { err });
    } else {
      db.CommentRepository.create({ description }, (err, comment) => {
        if (err) {
          callback(err, { err });
        } else {
          // Add author in comment
          comment.author._id = userId;
          comment.save();
          // Add comment in newsfeed
          newfeed.comments.push(comment);
          newfeed.save();

          callback(null, comment);
        }
      });
    }
  });
}

module.exports = {
  createComment,
};
