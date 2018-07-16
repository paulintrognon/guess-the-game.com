const bluebird = require('bluebird');
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
    imageUrl: screenshotToCreate.imageUrl,
  });
  const names = getScreenshotNames(screenshotToCreate);
  await Promise.all([
    user.addScreenshot(screenshot),
    addScreenshotNames(screenshot, names),
  ]);
  return screenshot;
}

async function addScreenshotNames(screenshot, names) {
  const bulkInstructions = names.map(name => ({ name }));
  const screenshotNames = await db.ScreenshotName.bulkCreate(bulkInstructions);
  return bluebird.map(screenshotNames, scrennshotName =>
    screenshot.addScreenshotName(scrennshotName)
  );
}

function getScreenshotNames(screenshot) {
  const names = [screenshot.gameCanonicalName];
  screenshot.alternativeNames.forEach(name => {
    if (name.trim()) {
      names.push(name);
    }
  });
  return names;
}
