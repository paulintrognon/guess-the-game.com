const db = require('../../db/db');

module.exports = {
  create,
  get,
  update,
  isUsernameFree,
  getScores,
  getSolvedScreenshots,
  getAddedScreenshots,
  getScreenshotRating,
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

async function getScores({ totalNbScreenshots }) {
  return db.User.findAll({
    attributes: [
      'username',
      'solvedScreenshots',
      'addedScreenshots',
      [
        db.Sequelize.literal(
          `solvedScreenshots / (${totalNbScreenshots} - addedScreenshots)`
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
          `solvedScreenshots / (${totalNbScreenshots} - addedScreenshots)`
        ),
        'DESC',
      ],
      ['solvedScreenshots', 'DESC'],
      ['addedScreenshots', 'DESC'],
    ],
  })
    .map(user => user.get({ plain: true }))
    .map(userScore => ({
      id: userScore.id,
      username: userScore.username,
      nbSolvedScreenshots: userScore.solvedScreenshots,
      nbAddedScreenshots: userScore.addedScreenshots,
      completeness: userScore.completeness,
    }));
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
  return results.map(res => res.get({ plain: true })).map(res => ({
    ...res.Screenshot,
    solvedAt: res.createdAt,
  }));
}

async function getAddedScreenshots(userId) {
  const results = await db.Screenshot.findAll({
    attributes: ['id', 'gameCanonicalName', 'year', 'imagePath', 'createdAt'],
    include: { model: db.ScreenshotName },
    where: { UserId: userId },
    limit: 100,
    order: [['createdAt', 'DESC']],
  });
  return results.map(screenshot => ({
    id: screenshot.id,
    gameCanonicalName: screenshot.gameCanonicalName,
    alternativeNames: screenshot.ScreenshotNames.map(name => name.name).filter(
      name => name !== screenshot.gameCanonicalName
    ),
    year: screenshot.year,
    imagePath: screenshot.imagePath,
    createdAt: screenshot.createdAt,
    approvalStatus: screenshot.approvalStatus,
  }));
}

async function getScreenshotRating({ userId, screenshotId }) {
  const rating = await db.ScreenshotRating.findOne({
    attributes: ['rating'],
    where: { UserId: userId, ScreenshotId: screenshotId },
  });
  if (!rating) {
    return null;
  }
  return rating.rating;
}
