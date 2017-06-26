const UserCache = require('../caches/user');

const cache = (new UserCache()).getInstance();

// data: { _id, latlng }
function setUserValue(userId, data) {
  return new Promise((resolve) => {
    const cachedData = JSON.parse(JSON.stringify(data));
    cache.set(JSON.stringify(userId), cachedData, ((error, success) => {
      if (!error && success) {
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
    const value = cache.get(JSON.stringify(userId));
    if (value === undefined) {
      resolve({ _id: userId });
    } else {
      console.log('getUserValue', userId, value);
      resolve(value);
    }
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
