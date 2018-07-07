const db = require('../../db/db');

module.exports = {
  create,
  isUsernameFree,
};

function create(userToCreate) {
  return db.User.create(userToCreate);
}

function isUsernameFree(username) {
  return db.User.findOne({
    where: { username: { like: username } },
  }).then(user => user === null);
}
