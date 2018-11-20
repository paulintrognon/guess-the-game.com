const bluebird = require('bluebird');
const bcrypt = require('bcrypt');
const config = require('../../../config/index');
const userManager = require('../managers/userManager');
const tokenService = require('../services/tokenService');
const emailService = require('../services/emailService');
const logger = require('../../logger');

const SALT_ROUNDS = 4;

module.exports = {
  checkUsernameAvailability,
  login,
  register,
  preLog,
  requestNewPassword,
  changePassword,
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
        return returnLoggedUser(user);
      });
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

  return hashPassword(req.body.password)
    .then(hashedPassword => {
      const user = {
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
      };

      logger.info('Registering new user', { username: req.body.username });

      // Si l'utilisateur a déjà un compte mais pas encore d'email, on met à jour
      if (req.body.jwt && !req.user.email) {
        return userManager.update(req.user.id, user);
      }
      // Sinon, on crée le nouvel utilisateur
      return userManager.create(user);
    })
    .then(user => returnLoggedUser(user));
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

async function changePassword(req) {
  const { token, password } = req.body;
  const decodedToken = tokenService.decode(token);

  if (Date.now() > decodedToken.iat * 1000) {
    return bluebird.reject({
      code: 'OUTDATED_TOKEN',
      message: 'Your token has expired.',
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = await userManager.update(decodedToken.id, {
    password: hashedPassword,
  });
  logger.info('User changed password', { username: user.username });
  return returnLoggedUser(user);
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function returnLoggedUser(user) {
  const jwt = await tokenService.createUserToken(user);
  return {
    jwt,
    username: user.username,
    canModerateScreenshots: user.canModerateScreenshots,
  };
}
