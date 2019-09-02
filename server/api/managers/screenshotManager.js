const bluebird = require('bluebird');
const fs = require('fs');
const phonetiksService = require('../services/phonetiksService');
const screenshotService = require('../services/screenshotService');
const cloudinaryService = require('../services/cloudinaryService');
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
  rate,
};

async function create(screenshotToCreate) {
  const user = await db.User.findByPk(screenshotToCreate.userId);
  if (!user) {
    throw new Error('User not found');
  }

  const screenshot = await db.Screenshot.create({
    gameCanonicalName: screenshotToCreate.gameCanonicalName.trim(),
    year: screenshotToCreate.year,
    ...(user.canModerateScreenshots
      ? {
          approvalStatus: 'approved',
          moderatedBy: user.id,
          moderatedAt: new Date(),
        }
      : {
          approvalStatus: 'waiting',
        }),
  });

  const names = getScreenshotNames(screenshotToCreate);
  await Promise.all([
    user.addScreenshot(screenshot),
    addScreenshotNames(screenshot, names),
    uploadScreenshotImage(screenshotToCreate.localImagePath, screenshot),
    user.canModerateScreenshots ? user.increment('addedScreenshots') : null,
  ]);

  return getFromId(screenshot.id);
}

async function edit({ id, user, localImagePath, data }) {
  const screenshot = await db.Screenshot.findByPk(id);
  if (!screenshot) {
    throw new Error('screenshot not found');
  }
  let newApprovalStatus = screenshot.approvalStatus;
  if (!user.canModerateScreenshots) {
    // Si l'utilisateur n'est pas modérateur ni propriétaire de son screenshot
    if (user.id !== screenshot.UserId) {
      throw new Error('No rights to edit that screenshot');
    }
    // Si l'utilisateur n'est pas modérateur et le screenshot est déjà approuvé
    if (screenshot.approvalStatus === 'approved') {
      throw new Error('Impossible de modifier un screenshot déjà validé.');
    }
    // Si l'utilisateur tente de modifier une image...
    if (localImagePath) {
      // ...on la passe à nouveau en attente
      newApprovalStatus = 'waiting';
    }
  }

  // Ajout de la nouvelle image (si besoin)
  const newScreenshotImage = await (localImagePath &&
    uploadScreenshotImage(localImagePath, screenshot));

  // Mise à jour des données de la screenshots
  await screenshot.update({
    gameCanonicalName: data.gameCanonicalName,
    approvalStatus: newApprovalStatus,
    year: data.year || null,
    ...(localImagePath && { ScreenshotImageId: newScreenshotImage.id }),
  });

  // Mise à jour des noms
  const names = getScreenshotNames(data);
  await addScreenshotNames(screenshot, names);

  return screenshot;
}

async function addScreenshotNames(screenshot, names) {
  await db.ScreenshotName.destroy({ where: { ScreenshotId: screenshot.id } });
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
    {
      attributes: ['path'],
      model: db.ScreenshotImage,
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
    db.Screenshot.findByPk(screenshotId, { include }),
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
    imageUrl: res.ScreenshotImage.url,
    createdAt: res.createdAt,
    approvalStatus: res.approvalStatus,
    user: res.User,
    solvedScreenshots: res.SolvedScreenshots,
    rating: res.rating,
  };
}

async function getLastAdded() {
  const screenshot = await db.Screenshot.findOne({
    attributes: ['id'],
    where: { approvalStatus: 'approved' },
    order: [['moderatedAt', 'DESC']],
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

async function getUnsolved({ userId, unseenOnly, exclude }) {
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
      Screenshot.approvalStatus = 'approved'
      ${
        userId
          ? `
      AND (Screenshot.UserId != :userId)
      AND NOT EXISTS (
        SELECT id FROM SolvedScreenshots
        WHERE
          SolvedScreenshots.ScreenshotId = Screenshot.id
          AND SolvedScreenshots.UserId = :userId
      ) `
          : ''
      }
      ${
        userId && unseenOnly
          ? `
      AND NOT EXISTS (
        SELECT id FROM ViewedScreenshots
        WHERE
          ViewedScreenshots.ScreenshotId = Screenshot.id
          AND ViewedScreenshots.UserId = :userId
      ) `
          : ''
      }
      ${
        exclude && exclude.length
          ? `AND (Screenshot.Id NOT IN (:screenshotIds) )`
          : ''
      }
    )
    ORDER BY RAND()
    LIMIT 1
  `,
    {
      model: db.Screenshot,
      replacements: { userId, screenshotIds: exclude },
    }
  );
  return screenshots[0];
}

async function getTotalNb() {
  return db.Screenshot.count({
    where: { approvalStatus: 'approved' },
  });
}

async function getPrevAndNext({ screenshotId }) {
  const [prev, next] = await Promise.all([
    db.Screenshot.findOne({
      attributes: ['id'],
      where: {
        approvalStatus: 'approved',
        id: { [db.Sequelize.Op.lt]: screenshotId },
      },
      order: [['createdAt', 'DESC']],
    }),
    db.Screenshot.findOne({
      attributes: ['id'],
      where: {
        approvalStatus: 'approved',
        id: { [db.Sequelize.Op.gt]: screenshotId },
      },
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
  const wasScreenshotActive = screenshot.approvalStatus === 'approved';
  // On supprime le screenshot
  await screenshot.destroy();
  // Si le screenshot n'était pas en jeu, on s'arrête là
  if (!wasScreenshotActive) {
    return;
  }
  // Si le screenshot était en jeu, on met à jour les scores
  await Promise.all([
    // On décrémente le compte de screenshots ajoutés par le user
    db.User.findByPk(userId).then(
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

async function rate({ screenshotId, userId, rating }) {
  // On vérifie que l'utilisateur a bien le droit de noter le screenshot
  const [screenshot, user] = await Promise.all([
    db.Screenshot.findByPk(screenshotId),
    db.User.findByPk(userId),
  ]);
  if (!screenshot) {
    throw new Error('Screenshot does not exist');
  }
  if (!user) {
    throw new Error('User does not exist');
  }
  if (screenshot.UserId === userId) {
    throw new Error('Cannot rate your own screenshot');
  }

  // On supprime la précédente note
  await db.ScreenshotRating.destroy({
    where: { ScreenshotId: screenshotId, UserId: userId },
  });

  // On ajoute la nouvelle note
  const screenshotRating = await db.ScreenshotRating.create({ rating });
  await Promise.all([
    user.addScreenshotRating(screenshotRating),
    screenshot.addScreenshotRating(screenshotRating),
  ]);

  // On récupère l'average
  const average = await db.ScreenshotRating.findOne({
    attributes: [
      [db.Sequelize.fn('AVG', db.Sequelize.col('rating')), 'averageRating'],
    ],
    where: { ScreenshotId: screenshotId },
  });
  const averageRating = average
    ? average.get({ plain: true }).averageRating
    : null;

  // On met à jour le score de la screnshot
  await screenshot.update({
    rating: averageRating,
  });
  return { averageRating };
}

function getScreenshotNames(screenshot) {
  // We compile all the screenshot names
  const names = screenshotService.compileScreenshotNames(screenshot);
  // Then we compute their phonetics
  return names.map(name => {
    const phonetiks = phonetiksService.toPhonetik(name);
    return {
      name,
      dm1: phonetiks[0],
      dm2: phonetiks[1],
    };
  });
}

async function uploadScreenshotImage(localImagePath, screenshot) {
  if (!fs.existsSync(localImagePath)) {
    throw new Error('Sorry, your image has been deleted, please re-upload it');
  }

  // Uploading image to cloudinary
  const cloudinaryImage = await cloudinaryService.uploadImage(localImagePath);

  // Registering the image to the database
  return screenshot.createScreenshotImage({
    ...cloudinaryImage,
    ScreenshotId: screenshot.id,
  });
}
