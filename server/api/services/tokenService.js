const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/server');

const logger = require('../../logger');

module.exports = {
  createToken,
  decode,
};

function createToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, secret);
}

function decode(token) {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    logger.error(e.message);
    return null;
  }
}
