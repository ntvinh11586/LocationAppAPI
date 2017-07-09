const UserCache = require('../caches/user');

const cache = (new UserCache()).getInstance();

function getUserValue(userId) {
  return new Promise((resolve) => {
    cache.get(JSON.stringify(userId), (error, value) => {
      if (value === null || value === undefined) {
        resolve({ _id: userId });
      } else {
        console.log('getUserValue', userId, JSON.parse(value));
        resolve(JSON.parse(value));
      }
    });
  });
}

// data: { _id, latlng, groups: [ { group_id }] }
function setUserValue(userId, data) {
  getUserValue(userId)
    .then((data1) => {
      const value = {
        _id: data._id || data._id || userId,
        latlng: data.latlng || data1.latlng || undefined,
        groups: data.groups || data1.groups || undefined,
      };
      cache.set(
        JSON.stringify(userId),
        JSON.stringify(value),
        ((error, success) => {
          if (!error && success) {
            console.log('setUserValue', userId, value);
            return value;
          }
          return { _id: userId };
        }));
    });
}


function deleteUserValue(userId) {
  return new Promise((resolve) => {
    cache.del(JSON.stringify(userId), (error, value) => {
      if (!error) {
        console.log('deleteUserValue', userId, value);
        resolve(value === 1);
      }
    });
  });
}

module.exports = {
  setUserValue,
  getUserValue,
  deleteUserValue,
};
