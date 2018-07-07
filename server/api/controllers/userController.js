const bcrypt = require('bcrypt');
const userManager = require('../managers/userManager');

const saltRounds = 4;

module.exports = {
  checkUsernameAvailability,
  register,
};

function checkUsernameAvailability(req) {
  const { username } = req.body;
  return userManager
    .isUsernameFree(username)
    .then(isFree => ({ username, isFree }));
}

function register(req) {
  ['email', 'username', 'password'].forEach(field => {
    if (!req.body[field]) {
      throw new Error(`User ${field} cannot be null`);
    }
  });

  return bcrypt.hash(req.body.password, saltRounds).then(hash =>
    userManager.create({
      email: req.body.email,
      username: req.body.username,
      password: hash,
    })
  );
}
