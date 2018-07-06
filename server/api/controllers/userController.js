const bcrypt = require('bcrypt');
const usersManager = require('../managers/userManager');

const saltRounds = 4;

module.exports = {
  register,
};

function register(req) {
  ['email', 'nickname', 'password'].forEach(field => {
    if (!req.body[field]) {
      throw new Error(`User ${field} cannot be null`);
    }
  });

  return bcrypt.hash(req.body.password, saltRounds).then(hash =>
    usersManager.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hash,
    })
  );
}
