const db = require('../../db/db');

module.exports = {
  create,
  update,
  isUsernameFree,
};

function create(userToCreate) {
  return db.User.create(userToCreate);
}

function update(userId, updates) {
  return db.User.findById(userId).then(user => {
    if (!user) {
      throw new Error('User to update not found');
    }
    return user.update(updates);
  });
}

function isUsernameFree(username) {
  return db.User.findOne({
    where: { username: { like: username } },
  }).then(user => user === null);
}
