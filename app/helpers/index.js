const db = require('../db');

// find a single user based on a key
const findOne = (profileId) => {
  return db.userModel.findOne({
    profileId,
  });
};

const createNewUser = (profile) => {
  return new Promise((resolve, reject) => {
    const newChatUser = new db.userModel({
      profileId: profile.id,
      fullName: profile.displayName,
      profilePic: profile.photos[0].value || '',
    });

    newChatUser.save((error) => {
      if (error) {
        reject(error);
      } else {
        resolve(newChatUser);
      }
    });
  });
};

// serialize and deserialize - 052
// The ES6 promisified version of findById
const findById = (id) => {
  return new Promise((resolve, reject) => {
    db.userModel.findById(id, (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
};

// A middleware that checks to see if the user is authenticated & logged in
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  findOne,
  createNewUser,
  findById,
  isAuthenticated,
};
