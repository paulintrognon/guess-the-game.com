const bluebird = require('bluebird');
const phonetiksService = require('../services/phonetiksService');
const db = require('../../db/db');

module.exports = {
  create,
  edit,
  getFromId,
  getLastAdded,
  getUnsolved,
  getTotalNb,
  getPrevAndNext,
  deleteUserScreenshot,
  removeSolvedPointsForScreenshot,
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
    approvalStatus: user.canModerateScreenshots ? 1 : 0,
  });
  const names = getScreenshotNames(screenshotToCreate);
  await Promise.all([
    user.addScreenshot(screenshot),
    addScreenshotNames(screenshot, names),
    user.canModerateScreenshots ? user.increment('addedScreenshots') : null,
  ]);
  return screenshot;
}

async function edit({ id, user, data }) {
  const screenshot = await db.Screenshot.findById(id);
  if (!screenshot) {
    throw new Error('screenshot not found');
  }
  if (!user.canModerateScreenshots && user.id !== screenshot.UserId) {
    throw new Error('No rights to edit that screenshot');
  }
  screenshot.update({
    gameCanonicalName: data.gameCanonicalName,
    year: data.year,
  });
  const names = getScreenshotNames(data);
  await db.ScreenshotName.destroy({ where: { ScreenshotId: id } });
  await addScreenshotNames(screenshot, names);
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
  if (!screenshot) {
    return null;
  }
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
    where: {
      ScreenshotId: screenshotId,
      '$User.username$': {
        [db.Sequelize.Op.not]: null,
      },
    },
    include: {
      attributes: ['username'],
      model: db.User,
    },
  });
}

async function getFirstSolvedBy(screenshotId) {
  const solvedScreenshot = await db.SolvedScreenshot.findOne({
    attributes: [],
    where: {
      ScreenshotId: screenshotId,
      '$User.username$': {
        [db.Sequelize.Op.not]: null,
      },
    },
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
      ${
        exclude && exclude.length
          ? `AND (Screenshot.Id NOT IN (${exclude.join(',')}) )`
          : ''
      }
    )
    ORDER BY RAND()
    LIMIT 1
  `,
    { model: db.Screenshot }
  );
  return screenshots[0];
}

async function getTotalNb() {
  return db.Screenshot.count({
    where: { approvalStatus: 1 },
  });
}

async function getPrevAndNext({ screenshotId }) {
  const [prev, next] = await Promise.all([
    db.Screenshot.findOne({
      attributes: ['id'],
      where: { approvalStatus: 1, id: { [db.sequelize.Op.lt]: screenshotId } },
      order: [['createdAt', 'DESC']],
    }),
    db.Screenshot.findOne({
      attributes: ['id'],
      where: { approvalStatus: 1, id: { [db.sequelize.Op.gt]: screenshotId } },
      order: [['createdAt', 'ASC']],
    }),
  ]);
  return { prev: prev && prev.id, next: next && next.id };
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
    return;
  }
  // On supprime le screenshot
  await screenshot.destroy();
  // Si ça s'est bien passé
  await Promise.all([
    // on décrémente le compte de screenshots ajoutés par le user
    db.User.findById(userId).then(
      user => user && user.decrement('addedScreenshots')
    ),
    // et on enlève les points du screenshot aux joueurs qui l'ont trouvé
    removeSolvedPointsForScreenshot({ screenshotId }),
  ]);
}

async function removeSolvedPointsForScreenshot({ screenshotId }) {
  const solvedScreenshots = await db.SolvedScreenshot.findAll({
    where: { ScreenshotId: screenshotId },
    include: { model: db.User },
  });
  await bluebird.map(solvedScreenshots, solvedScreenshot =>
    Promise.all([
      solvedScreenshot.User.decrement('solvedScreenshots'),
      solvedScreenshot.destroy(),
    ])
  );
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
