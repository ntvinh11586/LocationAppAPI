const newfeedRepository = require('../repositories/newfeed');
const commentRepository = require('../repositories/comment');

function createComment(newfeedId, userId, description, callback) {
  newfeedRepository.findById(newfeedId, (err, newfeed) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else {
      commentRepository.create({ description }, (err, comment) => {
        if (err) {
          callback(err, {
            status_code: 422,
            success: false,
            status_message: err.message,
          });
        } else {
          // Add author's comment.
          comment.author._id = userId;
          comment.save();
          // Add comment to newsfeed.
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
