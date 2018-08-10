const bluebird = require('bluebird');
const bcrypt = require('bcrypt');
const config = require('../../../config/index');
const userManager = require('../managers/userManager');
const tokenService = require('../services/tokenService');
const emailService = require('../services/emailService');

const saltRounds = 4;

module.exports = {
  checkUsernameAvailability,
  login,
  register,
  preLog,
  requestNewPassword,
};

function checkUsernameAvailability(req) {
  const { username } = req.body;
  return userManager
    .isUsernameFree(username)
    .then(isFree => ({ username, isFree }));
}

function login(req) {
  return userManager.get(req.body.username).then(user => {
    if (!user) {
      return bluebird.reject({
        code: 'LOGIN_USER_NOT_FOUND',
        message: 'User not found',
      });
    }
    return bcrypt
      .compare(req.body.password, user.password)
      .then(passwordsMatch => {
        if (!passwordsMatch) {
          return bluebird.reject({
            code: 'LOGIN_INCORRECT_PASSWORD',
            message: 'Wrong password',
          });
        }
        return tokenService.createUserToken(user);
      })
      .then(jwt => ({
        jwt,
        username: user.username,
      }));
  });
}

function preLog() {
  return userManager
    .create({})
    .then(user => tokenService.createUserToken(user));
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
      if (req.body.jwt && !req.user.email) {
        return userManager.update(req.user.id, user);
      }
      // Sinon, on crée le nouvel utilisateur
      return userManager.create(user);
    })
    .then(user => tokenService.createUserToken(user))
    .then(jwt => ({
      jwt,
      username: req.body.username,
    }));
}

async function requestNewPassword(req) {
  const user = await userManager.get(req.body.email);
  if (!user) {
    return bluebird.reject({
      code: 'LOGIN_USER_NOT_FOUND',
      message: 'User not found',
    });
  }

  const token = await tokenService.createNewPasswordRequestToken(user);
  const link = `${config.frontUrl}/new-password/${token}`;

  return emailService.sendRequestNewPasswordEmail({
    link,
    email: user.email,
    username: user.username,
  });
}
