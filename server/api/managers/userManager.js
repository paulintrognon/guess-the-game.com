const db = require('../../db/db');

module.exports = {
  create,
};

function create(userToCreate) {
  return db.User.create(userToCreate);
}
