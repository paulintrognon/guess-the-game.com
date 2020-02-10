const db = require('../../db/db');

module.exports = {
  create,
  get,
  getById,
  update,
  isUsernameFree,
  getNewRanking,
  getScreenshotRating,
  getTotalNb,
};

function create(userToCreate) {
  return db.User.create({
    ...userToCreate,
    emailUpdates: userToCreate.emailUpdates || 'never',
  });
}

function getById(userId) {
  return db.User.findByPk(userId);
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

async function update(userId, updates) {
  const user = await db.User.findByPk(userId);
  if (!user) {
    throw new Error('User to update not found');
  }
  return user.update(updates);
}

async function isUsernameFree(username) {
  const user = await db.User.findOne({
    where: { username: { [db.Sequelize.Op.like]: username } },
  });
  return user === null;
}

async function getNewRanking(userId) {
  const user = await db.User.findByPk(userId);
  const userCurrentScore = user.solvedScreenshots + user.addedScreenshots;

  return db.sequelize.query(
    `
    SELECT
      COUNT(IF(user_rankings.score >= :userCurrentScore ,1,NULL))+1 AS currentRanking,
      COUNT(IF(user_rankings.score >= :userCurrentScore +1,1,NULL))+1 AS newRanking
    FROM (
      SELECT
        solvedScreenshots + addedScreenshots AS score
      FROM Users
      WHERE
        Users.email IS NOT NULL
        AND Users.id != :userId
      ) AS user_rankings
  `,
    {
      plain: true,
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { userCurrentScore, userId },
    }
  );
}

async function getScreenshotRating({ screenshotId, userId }) {
  if (!userId || !screenshotId) {
    return null;
  }
  const rating = await db.ScreenshotRating.findOne({
    attributes: ['rating'],
    where: { UserId: userId, ScreenshotId: screenshotId },
  });
  if (!rating) {
    return null;
  }
  return rating.rating;
}

async function getTotalNb() {
  return db.User.count({
    where: { email: { [db.Sequelize.Op.ne]: null } },
  });
}
