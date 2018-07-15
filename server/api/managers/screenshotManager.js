const db = require('../../db/db');

module.exports = {
  create,
};

async function create(screenshotToCreate) {
  const user = await db.User.findById(screenshotToCreate.userId);
  if (!user) {
    throw new Error('User not found');
  }
  const screenshot = await db.Screenshot.create({
    gameCanonicalName: screenshotToCreate.gameCanonicalName,
    difficulty: screenshotToCreate.difficulty,
    imageUrl: screenshotToCreate.imageUrl,
  });
  return user.addScreenshot(screenshot);
}

async function createScreenshotNames(screenshot) {
  const names = [...screenshot.alternativeNames].concat([screenshot.name]);
  const bulkInstructions = names.map(name => ({
    name,
  }));
}
