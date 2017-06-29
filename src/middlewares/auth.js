const demoModel = require('../models/demo');
const tokenExpiredDomain = require('../domains/token_expired');

function isUserAuthenticated(req, res, next) {
  const token = req.headers.token;
  demoModel.authorization(token, (err, data) => {
    if (err) {
      res.status(401).json(data);
    } else {
      tokenExpiredDomain.hasToken(token)
        .then((hasToken) => {
          if (false) {
            res.status(401).json({
              status_code: 401,
              success: false,
              status_message: 'Invalid authorization.',
            });
          } else {
            res.locals.user_id = data.user_id;
            res.locals.username = data.username;
            res.locals.token = token;
            next();
          }
        });
    }
  });
}

module.exports = {
  isUserAuthenticated,
};
