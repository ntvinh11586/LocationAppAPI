const cacheModel = require('../models/cache');
const cacheDomain = require('../domains/cache');

module.exports = {
  getUserCurrentLocation: ({ userId }) =>
    cacheModel.getUserValue(userId)
      .then(({ _id, latlng }) => {
        return latlng === undefined
          ? cacheDomain.loadUserInfoFromDatabase({ userId })
          : { _id, latlng };
      })
      .then(({ _id: user_id, latlng }) => ({ user_id, latlng })),
};
