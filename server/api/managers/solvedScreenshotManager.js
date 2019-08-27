const db = require('../../db/db');

module.exports = {
  getSolvedScreenshots,
  getNbTotalOfSolvedScreenshots,
  markScreenshotAsResolved,
};

async function getNbTotalOfSolvedScreenshots(userId) {
  count;
}

async function getSolvedScreenshots(userId, params) {
  const { limit, offset } = params || {};
  const { count, rows } = await db.SolvedScreenshot.findAndCountAll({
    attributes: ['createdAt'],
    where: { UserId: userId },
    offset: offset || 0,
    limit: limit || 100,
    order: [['createdAt', 'DESC']],
    include: {
      model: db.Screenshot,
      attributes: ['id', 'gameCanonicalName', 'year', 'createdAt'],
      include: {
        model: db.ScreenshotImage,
        attributes: ['path'],
      },
    },
  });
  return {
    total: count,
    screenshots: rows.map(res => ({
      id: res.Screenshot.id,
      gameCanonicalName: res.Screenshot.gameCanonicalName,
      year: res.Screenshot.year,
      imageUrl: res.Screenshot.ScreenshotImage.thumbUrl,
      solvedAt: res.Screenshot.createdAt,
    })),
  };
}

async function markScreenshotAsResolved({ screenshotId, userId }) {
  const [user, screenshot, alreadySolved] = await Promise.all([
    db.User.findByPk(userId),
    db.Screenshot.findByPk(screenshotId),
    db.SolvedScreenshot.findOne({
      where: {
        ScreenshotId: screenshotId,
        UserId: userId,
      },
    }),
  ]);
  if (!user) {
    throw new Error('User not found');
  }
  if (!screenshot) {
    throw new Error('Screenshot not found');
  }
  if (alreadySolved) {
    throw new Error('User has already solved this screenshot');
  }
  const solvedScreenshot = await db.SolvedScreenshot.create();

  return Promise.all([
    user.addSolvedScreenshot(solvedScreenshot),
    screenshot.addSolvedScreenshot(solvedScreenshot),
    user.increment('solvedScreenshots'),
  ]);
}
