const db = require('../../db/db');

module.exports = {
  create,
  get,
  getById,
  update,
  isUsernameFree,
  getNewRanking,
  getScores,
  getSolvedScreenshots,
  getAddedScreenshots,
  getScreenshotRating,
};

function create(userToCreate) {
  return db.User.create({
    ...userToCreate,
    emailUpdates: userToCreate.emailUpdates || 'weekly',
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
      COUNT(IF(user_rankings.score >= ${userCurrentScore},1,NULL))+1 AS currentRanking,
      COUNT(IF(user_rankings.score >= ${userCurrentScore}+1,1,NULL))+1 AS newRanking
    FROM (
      SELECT
        solvedScreenshots + addedScreenshots AS score
      FROM Users
      WHERE
        Users.email IS NOT NULL
        AND Users.id != ${userId}
      ) AS user_rankings
  `,
    { plain: true, type: db.sequelize.QueryTypes.SELECT }
  );
}

async function getScores({ totalNbScreenshots }) {
  return db.sequelize.query(
    `
    SELECT
      username,
      solvedScreenshots AS nbSolvedScreenshots,
      addedScreenshots AS nbAddedScreenshots,
      (solvedScreenshots + addedScreenshots) AS score,
      (solvedScreenshots + addedScreenshots) / ${totalNbScreenshots} AS completeness,
      COUNT (IF(Screenshots.rating IS NOT NULL,1,NULL)) as nbRatedScreenshots,
      AVG(
        CASE
          WHEN Screenshots.deletedAt IS NULL AND Screenshots.approvalStatus = 1
          THEN Screenshots.rating ELSE NULL END
        ) AS averageUploadScore,
      (
        SELECT MAX(SolvedScreenshots.id)
        FROM SolvedScreenshots
        WHERE SolvedScreenshots.UserId = Screenshots.UserId
      ) AS lastScreenshotFound
    FROM
      Users
    LEFT JOIN
      Screenshots ON Screenshots.UserId = Users.id
    WHERE
      username IS NOT NULL
      AND Users.deletedAt IS NULL
    GROUP BY username
    ORDER BY
      score DESC,
      lastScreenshotFound ASC
    LIMIT 100`,
    { type: db.sequelize.QueryTypes.SELECT }
  );
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
  return results
    .map(res => res.get({ plain: true }))
    .map(res => ({
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
