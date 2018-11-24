const db = require('../../db/db');

module.exports = {
  getNonModeratedScreenshots,
  moderateScreenshot,
};

async function getNonModeratedScreenshots() {
  const results = await db.Screenshot.findAll({
    attributes: ['id', 'gameCanonicalName', 'year', 'imagePath', 'createdAt'],
    where: { approvalStatus: 0 },
    limit: 100,
    order: [['createdAt', 'ASC']],
  });
  return results.map(res => ({
    id: res.id,
    name: res.gameCanonicalName,
    year: res.year || null,
    createdAt: res.createdAt,
    imagePath: res.imagePath,
    awaitingApproval: true,
  }));
}

async function moderateScreenshot({ screenshotId, user, approve }) {
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
  if (approve && screenshot.approvalStatus === 1) {
    return;
  }
  if (!approve && screenshot.approvalStatus === -1) {
    return;
  }
  const shouldDecrement = !approve && screenshot.approvalStatus === 1;
  const poster = await db.User.findById(screenshot.UserId);
  await Promise.all([
    screenshot.update({
      approvalStatus: approve ? 1 : -1,
      moderatedBy: moderator.id,
    }),
    shouldDecrement ? poster.decrement('addedScreenshots') : null,
    approve ? poster.increment('addedScreenshots') : null,
  ]);
}
