const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/server');

const logger = require('../../logger');

module.exports = {
  createUserToken,
  createUserIdToken,
  decode,
  authenticateMiddleware,
};

function createUserToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      canModerateScreenshots: user.canModerateScreenshots,
    },
    secret
  );
}

function createUserIdToken(user) {
  return jwt.sign({ id: user.id }, secret);
}

function decode(token) {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    logger.error(e.message);
    return null;
  }
}

function authenticateMiddleware(req, res, next) {
  if (req.body && req.body.jwt) {
    req.user = decode(req.body.jwt) || {};
  } else {
    req.user = {};
  }
  next();
}
