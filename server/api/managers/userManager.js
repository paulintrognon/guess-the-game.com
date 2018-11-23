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
  const totalScreenshots = await db.Screenshot.count({
    where: { approvalStatus: 1 },
  });
  return db.User.findAll({
    attributes: [
      'username',
      'solvedScreenshots',
      'addedScreenshots',
      [
        db.Sequelize.literal(
          `solvedScreenshots / (${totalScreenshots} - addedScreenshots)`
        ),
        'completeness',
      ],
    ],
    where: {
      username: {
        [db.Sequelize.Op.not]: null,
      },
    },
    limit: 100,
    order: [
      [
        db.Sequelize.literal(
          `solvedScreenshots / (${totalScreenshots} - addedScreenshots)`
        ),
        'DESC',
      ],
      ['solvedScreenshots', 'DESC'],
      ['addedScreenshots', 'DESC'],
    ],
  }).map(user => user.get({ plain: true }));
}

async function getSolvedScreenshots(userId) {
  const results = await db.SolvedScreenshot.findAll({
    attributes: ['createdAt'],
    where: { UserId: userId },
    limit: 100,
    order: [['createdAt', 'DESC']],
    include: {
      model: db.Screenshot,
      attributes: ['id', 'gameCanonicalName', 'year', 'imagePath', 'createdAt'],
    },
  });
  return results.map(res => ({
    id: res.Screenshot.id,
    name: res.Screenshot.gameCanonicalName,
    year: res.Screenshot.year || null,
    createdAt: res.Screenshot.createdAt,
    solvedAt: res.createdAt,
    imagePath: res.Screenshot.imagePath,
  }));
}

async function getAddedScreenshots(userId) {
  const results = await db.Screenshot.findAll({
    attributes: ['id', 'gameCanonicalName', 'year', 'imagePath', 'createdAt'],
    where: { UserId: userId },
    limit: 100,
    order: [['createdAt', 'DESC']],
  });
  return results.map(res => ({
    id: res.id,
    name: res.gameCanonicalName,
    year: res.year || null,
    createdAt: res.createdAt,
    imagePath: res.imagePath,
  }));
}
