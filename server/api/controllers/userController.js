const bcrypt = require('bcrypt');
const userManager = require('../managers/userManager');
const tokenService = require('../services/tokenService');

const saltRounds = 4;

module.exports = {
  checkUsernameAvailability,
  register,
  preLog,
};

function checkUsernameAvailability(req) {
  const { username } = req.body;
  return userManager
    .isUsernameFree(username)
    .then(isFree => ({ username, isFree }));
}

function preLog() {
  return userManager.create({}).then(user => tokenService.createToken(user));
}

function register(req) {
  ['email', 'username', 'password'].forEach(field => {
    if (!req.body[field]) {
      throw new Error(`User ${field} cannot be null`);
    }
  });

  return bcrypt
    .hash(req.body.password, saltRounds)
    .then(hashedPassword => {
      const user = {
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
      };
      // Si l'utilisateur a déjà un compte mais pas encore d'email, on met à jour
      if (req.jwt && !req.jwt.email) {
        return userManager.update(req.userId, user);
      }
      // Sinon, on crée le nouvel utilisateur
      return userManager.create(user);
    })
    .then(user => tokenService.createToken(user))
    .then(jwt => ({
      jwt,
      username: req.body.username,
    }));
}
