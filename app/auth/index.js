const passport = require('passport');
const h = require('../helpers');

module.exports = () => {
  // Serialize and deserialize for Sessions
  // https://github.com/jaredhanson/passport#sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    h.findById(id)
        .then(user => done(null, user))
        .catch(error => console.log('Error when deserialize users', error));
  });
};
