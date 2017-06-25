const crypto = require('crypto');
const config = require('../config');

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function sha512(password, salt) {
  const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  const value = hash.digest('hex');
  return { salt, passwordHash: value };
}

function saltHashPassword(userpassword) {
  const salt = config.passwordHashKey;
  const passwordData = sha512(userpassword, salt);
  return passwordData.passwordHash;
}

module.exports = {
  saltHashPassword,
};
