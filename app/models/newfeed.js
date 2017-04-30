const db = require('../db');

function getNewFeeds(callback) {
  db.newfeedModel.find({}).populate('comments').exec((err, allNewfeed) => {
    if (err) {
      callback(null, err);
    } else {
      callback(null, { newfeeds: allNewfeed });
    }
  });
}

function getNewFeed(newfeedId, callback) {
  db.newfeedModel.findById(newfeedId).populate('comments').exec((err, newfeed) => {
    if (err) {
      callback(err, { err: 'err' });
    } else {
      callback(null, newfeed);
    }
  });
}

function createNewfeed(newfeed, callback) {
  db.newfeedModel.create(newfeed, (err, newlyNewfeed) => {
    if (err) {
      callback(err, { err: 'err' });
    }
    callback(null, newlyNewfeed);
  });
}

module.exports = {
  getNewFeeds,
  getNewFeed,
  createNewfeed,
};
