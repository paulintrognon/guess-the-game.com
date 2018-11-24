const db = require('../../db/db');

module.exports = {
  getScreenshots,
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
    order: [['createdAt', 'ASC']],
  }).map(screenshot => screenshot.get({ plain: true }));
}
async function moderateScreenshot({ screenshotId, user, newApprovalStatus }) {
  const [moderator, screenshot] = await Promise.all([
    db.User.findById(user.id),
    db.Screenshot.findById(screenshotId),
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
  const poster = await db.User.findById(screenshot.UserId);
  await Promise.all([
    screenshot.update({
      approvalStatus: newApprovalStatus,
      moderatedBy: moderator.id,
    }),
    shouldIncrement ? poster.increment('addedScreenshots') : null,
    shouldDecrement ? poster.decrement('addedScreenshots') : null,
  ]);
}
