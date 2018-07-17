const bluebird = require('bluebird');
const db = require('../../db/db');

module.exports = {
  create,
  getFromId,
  getUnsolved,
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

async function getFromId(screenshotId, userId) {
  let include;
  if (userId) {
    include = {
      model: db.ScreenshotFound,
      required: false,
      where: { UserId: userId },
    };
  }
  return db.Screenshot.findById(screenshotId, { include });
}

async function getUnsolved(userId) {
  const screenshots = await db.sequelize.query(
    `
    SELECT
      Screenshot.id,
      Screenshot.imageUrl,
      Screenshot.createdAt,
      ScreenshotFounds.UserId AS ScreenshotFoundsUserId,
      Users.username AS username
    FROM Screenshots AS Screenshot
    LEFT JOIN ScreenshotFounds ON Screenshot.id = ScreenshotFounds.ScreenshotId
    LEFT JOIN Users ON Screenshot.UserId = Users.id
    WHERE (
      Screenshot.deletedAt IS NULL
      AND (Screenshot.UserId != ${userId})
      AND (ScreenshotFounds.UserId IS NULL OR ScreenshotFounds.UserId != ${userId})
    )
    ORDER BY RAND()
    LIMIT 1
  `,
    { model: db.Screenshot }
  );
  return screenshots[0];
}
