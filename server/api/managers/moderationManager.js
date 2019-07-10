const db = require('../../db/db');
const screenshotManager = require('./screenshotManager');

module.exports = {
  getScreenshots,
  getModerators,
  moderateScreenshot,
};

async function getScreenshots({ approvalStatus = null, userId = null }) {
  const where = {};
  if (approvalStatus !== null) {
    where.approvalStatus = approvalStatus;
  }
  if (userId !== null) {
    where.moderatedBy = userId;
  }
  return db.Screenshot.findAll({
    attributes: [
      'id',
      'gameCanonicalName',
      'year',
      'imagePath',
      'createdAt',
      'approvalStatus',
    ],
    where,
    limit: 500,
    order: [['createdAt', 'DESC']],
    include: { model: db.ScreenshotName, attributes: ['name'] },
  }).map(screenshot => ({
    id: screenshot.id,
    gameCanonicalName: screenshot.gameCanonicalName,
    alternativeNames: screenshot.ScreenshotNames.map(name => name.name).filter(
      name => name !== screenshot.gameCanonicalName.toLowerCase()
    ),
    year: screenshot.year,
    imagePath: screenshot.imagePath,
    createdAt: screenshot.createdAt,
    approvalStatus: screenshot.approvalStatus,
  }));
}

async function moderateScreenshot({ screenshotId, user, newApprovalStatus }) {
  const [moderator, screenshot] = await Promise.all([
    db.User.findByPk(user.id),
    db.Screenshot.findByPk(screenshotId),
  ]);
  if (!moderator) {
    throw new Error('Moderator not found');
  }
  if (!screenshot) {
    throw new Error('Screenshot not found');
  }
  if (newApprovalStatus === screenshot.approvalStatus) {
    return;
  }
  const shouldIncrement = newApprovalStatus === 1;
  const shouldDecrement =
    newApprovalStatus === -1 && screenshot.approvalStatus === 1;
  const poster = await db.User.findByPk(screenshot.UserId);
  await Promise.all([
    screenshot.update({
      approvalStatus: newApprovalStatus,
      moderatedBy: moderator.id,
      moderatedAt: new Date(),
    }),
    shouldIncrement && poster.increment('addedScreenshots'),
    shouldDecrement && poster.decrement('addedScreenshots'),
    newApprovalStatus === -1 &&
      screenshotManager.removeSolvedPointsForScreenshot({ screenshotId }),
  ]);
}

async function getModerators() {
  return db.User.findAll({
    where: {
      canModerateScreenshots: 1,
    },
  });
}
