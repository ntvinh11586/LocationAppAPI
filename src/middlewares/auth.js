const demoModel = require('../models/demo');

function isUserAuthenticated(req, res, next) {
  const token = req.headers.token;
  demoModel.authorization(token, (err, data) => {
    if (err) {
      res.status(401).json(data);
    } else {
      res.locals.user_id = data.user_id;
      res.locals.username = data.username;
      res.locals.token = token;
      next();
    }
  });
}

module.exports = {
  isUserAuthenticated,
};
