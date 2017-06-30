const authModel = require('../models/auth');

module.exports = {
  registerUser: payload =>
    authModel.register(payload)
      .then((data) => {
        const userId = data._id;
        const username = data.username;
        return Promise.all([data, authModel.generateToken(userId, username)]);
      })
      .then((data) => {
        const user = data[0];
        const token = data[1];
        return {
          user_id: user._id,
          username: user.username,
          fullname: user.fullname,
          user_token: token,
          phone: user.phone,
          email: user.email,
          gender: user.gender,
          birthday: user.birthday,
          city: user.city,
        };
      }),
};
