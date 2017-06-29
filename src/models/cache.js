const UserCache = require('../caches/user');

const cache = (new UserCache()).getInstance();

// data: { _id, latlng, groups: [ { group_id }] }
function setUserValue(userId, data) {
  return new Promise((resolve) => {
    // TODO: Need to keep current fields not changed instead overwrite
    cache.set(
      JSON.stringify(userId),
      JSON.stringify(data),
      ((error, success) => {
        if (!error && success) {
          // TODO: Use async for Redis cache
          const value = cache.get(JSON.stringify(userId));
          if (value !== undefined) {
            console.log('setUserValue', userId, value);
            resolve(value);
          }
        }
      }));
  });
}

function getUserValue(userId) {
  return new Promise((resolve) => {
    cache.get(JSON.stringify(userId), (error, value) => {
      if (value === undefined) {
        resolve({ _id: userId });
      } else {
        console.log('getUserValue', userId, JSON.parse(value));
        resolve(JSON.parse(value));
      }
    });
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
