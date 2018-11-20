const bluebird = require('bluebird');
const phonetiksService = require('../services/phonetiksService');
const db = require('../../db/db');

module.exports = {
  create,
  getFromId,
  getLastAdded,
  getUnsolved,
  getNonModeratedScreenshots,
  deleteUserScreenshot,
  testProposal,
  markScreenshotAsResolved,
  moderateScreenshot,
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
      model: db.SolvedScreenshot,
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
    approvalStatus: res.approvalStatus,
    user: res.User,
    solvedScreenshots: res.SolvedScreenshots,
  };
}

async function getLastAdded() {
  const screenshot = await db.Screenshot.findOne({
    attributes: ['id'],
    where: { approvalStatus: 1 },
    limit: 1,
    order: [['createdAt', 'DESC']],
  });
  return screenshot.id;
}

async function getScreenshotStats(screenshotId) {
  const [solvedCount, firstSolvedBy] = await Promise.all([
    countSolved(screenshotId),
    getFirstSolvedBy(screenshotId),
  ]);
  return {
    solvedCount,
    firstSolvedBy,
  };
}

async function countSolved(screenshotId) {
  return db.SolvedScreenshot.count({
    where: { ScreenshotId: screenshotId },
  });
}

async function getFirstSolvedBy(screenshotId) {
  const solvedScreenshot = await db.SolvedScreenshot.findOne({
    attributes: [],
    where: { ScreenshotId: screenshotId },
    limit: 1,
    order: [['createdAt', 'ASC']],
    include: {
      attributes: ['username'],
      model: db.User,
    },
  });
  if (!solvedScreenshot) {
    return null;
  }
  return solvedScreenshot.User.username || 'John Doe';
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
      Screenshot.deletedAt IS NULL AND
      Screenshot.approvalStatus = 1
      ${
        userId
          ? `
      AND (Screenshot.UserId != ${userId})
      AND NOT EXISTS (
        SELECT id FROM SolvedScreenshots
        WHERE
          SolvedScreenshots.ScreenshotId = Screenshot.id
          AND SolvedScreenshots.UserId = ${userId}
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
  const [user, screenshot, alreadySolved] = await Promise.all([
    db.User.findById(userId),
    db.Screenshot.findById(screenshotId),
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
  const poster = await db.User.findById(screenshot.UserId);
  return Promise.all([
    screenshot.update({
      approvalStatus: approve ? 1 : -1,
      moderatedBy: moderator.id,
    }),
    approve ? poster.increment('addedScreenshots') : null,
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
