const bluebird = require('bluebird');
const phonetiksService = require('../services/phonetiksService');
const db = require('../../db/db');

module.exports = {
  create,
  getFromId,
  getLastPosted,
  getUnsolved,
  deleteUserScreenshot,
  testProposal,
  markScreenshotAsResolved,
};

async function create(screenshotToCreate) {
  const user = await db.User.findById(screenshotToCreate.userId);
  if (!user) {
    throw new Error('User not found');
  }
  const screenshot = await db.Screenshot.create({
    gameCanonicalName: screenshotToCreate.gameCanonicalName,
    imagePath: screenshotToCreate.imagePath,
    year: screenshotToCreate.year,
  });
  const names = getScreenshotNames(screenshotToCreate);
  await Promise.all([
    user.addScreenshot(screenshot),
    addScreenshotNames(screenshot, names),
    user.increment('screenshotsAdded'),
  ]);
  return screenshot;
}

async function addScreenshotNames(screenshot, names) {
  const screenshotNames = await db.ScreenshotName.bulkCreate(names);
  return bluebird.map(screenshotNames, scrennshotName =>
    screenshot.addScreenshotName(scrennshotName)
  );
}

async function getFromId(screenshotId, userId) {
  const include = [
    {
      attributes: ['id', 'username'],
      model: db.User,
    },
  ];
  if (userId) {
    include.push({
      model: db.ScreenshotFound,
      required: false,
      where: { UserId: userId },
    });
  }
  const [res, stats] = await Promise.all([
    db.Screenshot.findById(screenshotId, { include }),
    getScreenshotStats(screenshotId),
  ]);
  if (!res) {
    return null;
  }
  return {
    stats,
    id: res.id,
    name: res.gameCanonicalName,
    year: res.year,
    imagePath: res.imagePath,
    createdAt: res.createdAt,
    user: res.User,
    screenshotFounds: res.ScreenshotFounds,
  };
}

async function getLastPosted() {
  const screenshot = await db.Screenshot.findOne({
    attributes: ['id'],
    limit: 1,
    order: [['createdAt', 'DESC']],
  });
  return screenshot.id;
}

async function getScreenshotStats(screenshotId) {
  const [foundsCount, firstSolvedBy] = await Promise.all([
    countFounds(screenshotId),
    getFirstSolvedBy(screenshotId),
  ]);
  return {
    foundsCount,
    firstSolvedBy,
  };
}

async function countFounds(screenshotId) {
  return db.ScreenshotFound.count({
    where: { ScreenshotId: screenshotId },
  });
}

async function getFirstSolvedBy(screenshotId) {
  const screenshotFound = await db.ScreenshotFound.findOne({
    attributes: [],
    where: { ScreenshotId: screenshotId },
    limit: 1,
    order: [['createdAt', 'ASC']],
    include: {
      attributes: ['username'],
      model: db.User,
    },
  });
  if (!screenshotFound) {
    return null;
  }
  return screenshotFound.User.username || 'John Doe';
}

async function getUnsolved({ userId, exclude }) {
  const screenshots = await db.sequelize.query(
    `
    SELECT
      Screenshot.id
    FROM
      Screenshots AS Screenshot
    LEFT JOIN
      Users ON Screenshot.UserId = Users.id
    WHERE (
      Screenshot.deletedAt IS NULL
      ${
        userId
          ? `
      AND (Screenshot.UserId != ${userId})
      AND NOT EXISTS (
        SELECT id FROM ScreenshotFounds
        WHERE
          ScreenshotFounds.ScreenshotId = Screenshot.id
          AND ScreenshotFounds.UserId = ${userId}
      ) `
          : ''
      }
      ${exclude ? `AND (Screenshot.Id != ${exclude})` : ''}
    )
    ORDER BY RAND()
    LIMIT 1
  `,
    { model: db.Screenshot }
  );
  return screenshots[0];
}

async function deleteUserScreenshot({ userId, screenshotId }) {
  const screenshot = await db.Screenshot.findOne({
    attributes: ['id'],
    where: {
      id: screenshotId,
      UserId: userId,
    },
  });
  if (!screenshot) {
    return null;
  }
  return screenshot.destroy();
}

async function testProposal(screenshotId, proposal) {
  const phonetiks = phonetiksService.toPhonetik(proposal);
  const screenshot = await db.ScreenshotName.findOne({
    attributes: ['id'],
    where: {
      [db.Sequelize.Op.and]: [
        { ScreenshotId: screenshotId },
        {
          [db.Sequelize.Op.or]: [
            { dm1: phonetiks[0] },
            { dm2: phonetiks[0] },
            { dm1: phonetiks[1] },
            { dm2: phonetiks[1] },
          ],
        },
      ],
    },
    include: {
      model: db.Screenshot,
      attributes: ['gameCanonicalName', 'year'],
    },
  });
  if (!screenshot) {
    return false;
  }
  return {
    name: screenshot.Screenshot.gameCanonicalName,
    year: screenshot.Screenshot.year,
  };
}

async function markScreenshotAsResolved({ screenshotId, userId }) {
  const [user, screenshot, alreadyFound] = await Promise.all([
    db.User.findById(userId),
    db.Screenshot.findById(screenshotId),
    db.ScreenshotFound.findOne({
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
  if (alreadyFound) {
    throw new Error('User has already found this screenshot');
  }
  const screenshotFound = await db.ScreenshotFound.create();

  return Promise.all([
    user.addScreenshotFound(screenshotFound),
    screenshot.addScreenshotFound(screenshotFound),
    user.increment('screenshotsFound'),
  ]);
}

function getScreenshotNames(screenshot) {
  const names = [screenshot.gameCanonicalName];
  screenshot.alternativeNames.forEach(name => {
    if (name.trim()) {
      names.push(name);
    }
  });
  return names.map(addPhonetiks);
}

function addPhonetiks(name) {
  const phonetiks = phonetiksService.toPhonetik(name);
  return {
    name,
    dm1: phonetiks[0],
    dm2: phonetiks[1],
  };
}
