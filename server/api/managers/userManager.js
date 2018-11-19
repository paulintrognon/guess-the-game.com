const db = require('../../db/db');

module.exports = {
  create,
  get,
  update,
  isUsernameFree,
  getScores,
  getSolvedScreenshots,
  getAddedScreenshots,
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
    attributes: ['username', 'solvedScreenshots', 'addedScreenshots'],
    where: {
      username: {
        [db.Sequelize.Op.not]: null,
      },
    },
    limit: 100,
    order: [['solvedScreenshots', 'DESC'], ['addedScreenshots', 'DESC']],
  });
}

async function getSolvedScreenshots(userId) {
  const results = await db.SolvedScreenshot.findAll({
    where: { UserId: userId },
    attributes: ['createdAt'],
    limit: 100,
    include: {
      model: db.Screenshot,
      attributes: ['id', 'gameCanonicalName', 'year', 'imagePath'],
    },
  });
  return results.map(res => ({
    id: res.Screenshot.id,
    name: res.Screenshot.gameCanonicalName,
    year: res.Screenshot.year || null,
    createdAt: res.createdAt,
    imagePath: res.Screenshot.imagePath,
  }));
}

async function getAddedScreenshots(userId) {
  const results = await db.Screenshot.findAll({
    where: { UserId: userId },
    attributes: ['id', 'gameCanonicalName', 'year', 'imagePath', 'createdAt'],
    limit: 100,
  });
  return results.map(res => ({
    id: res.id,
    name: res.gameCanonicalName,
    year: res.year || null,
    createdAt: res.createdAt,
    imagePath: res.imagePath,
  }));
}
