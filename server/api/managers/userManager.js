const db = require('../../db/db');

module.exports = {
  create,
  get,
  update,
  isUsernameFree,
  getScores,
};

function create(userToCreate) {
  return db.User.create(userToCreate);
}

function get(usernameOrEmail) {
  return db.User.findOne({
    where: {
      [db.Sequelize.Op.or]: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    },
  });
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

async function getScores() {
  return db.User.findAll({
    attributes: ['username', 'screenshotsFound', 'screenshotsAdded'],
    where: {
      username: {
        [db.Sequelize.Op.not]: null,
      },
    },
    limit: 100,
    order: [['screenshotsFound', 'DESC'], ['screenshotsAdded', 'DESC']],
  });
}
