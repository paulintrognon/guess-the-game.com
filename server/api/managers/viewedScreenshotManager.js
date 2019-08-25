const db = require('../../db/db');

module.exports = {
  markScreenshotAsViewed,
};

async function markScreenshotAsViewed({ screenshotId, userId }) {
  const [user, screenshot, alreadyViewed] = await Promise.all([
    db.User.findByPk(userId),
    db.Screenshot.findByPk(screenshotId),
    db.ViewedScreenshot.findOne({
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
  if (screenshot.UserId === userId) {
    return null;
  }
  if (alreadyViewed) {
    return null;
  }
  const viewedcreenshot = await db.ViewedScreenshot.create();

  return Promise.all([
    user.addViewedScreenshot(viewedcreenshot),
    screenshot.addViewedScreenshot(viewedcreenshot),
  ]);
}
