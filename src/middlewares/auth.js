const demoModel = require('../models/demo');

function isUserAuthenticated(req, res, next) {
  const token = req.headers.token;
  demoModel.authorization(token, (err) => {
    if (err) {
      res.status(401).json({
        status_code: 401,
        success: false,
        status_message: 'Invalid token key.',
      });
    } else {
      next();
    }
  });
}

module.exports = {
  isUserAuthenticated,
};
