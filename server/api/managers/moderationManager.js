const db = require('../../db/db');
const screenshotManager = require('./screenshotManager');

module.exports = {
  getScreenshots,
  getModerators,
  getLastModerated,
  moderateScreenshot,
};

async function getScreenshots(params) {
  const { approvalStatus, userId } = params || {};
  const { limit, offset, searchText } = params || {};

  const where = {};
  if (approvalStatus) {
    where.approvalStatus = approvalStatus;
  }
  if (userId) {
    where.moderatedBy = userId;
  }
  if (searchText) {
    where[db.Sequelize.Op.or] = [
      {
        id: { [db.Sequelize.Op.like]: `${searchText}%` },
      },
      {
        gameCanonicalName: {
          [db.Sequelize.Op.like]: `%${searchText}%`,
        },
      },
    ];
  }
  const { count, rows } = await db.Screenshot.findAndCountAll({
    attributes: [
      'id',
      'gameCanonicalName',
      'year',
      'createdAt',
      'approvalStatus',
      'refusalReason',
      'ScreenshotImageId',
    ],
    where,
    offset: offset || 0,
    limit: limit || 200,
    order: [
      [
        'createdAt',
        approvalStatus && approvalStatus === 'waiting' ? 'ASC' : 'DESC',
      ],
    ],
    include: [
      { model: db.ScreenshotName, attributes: ['name'] },
      { model: db.ScreenshotImage, attributes: ['path'] },
    ],
    distinct: true,
  });

  return {
    total: count,
    screenshots: rows.map(screenshot => ({
      id: screenshot.id,
      gameCanonicalName: screenshot.gameCanonicalName,
      alternativeNames: screenshot.ScreenshotNames.map(
        name => name.name
      ).filter(name => name !== screenshot.gameCanonicalName.toLowerCase()),
      year: screenshot.year,
      imageUrl: screenshot.ScreenshotImage.thumbUrl,
      createdAt: screenshot.createdAt,
      approvalStatus: screenshot.approvalStatus,
      refusalReason: screenshot.refusalReason,
    })),
  };
}

async function moderateScreenshot({
  screenshotId,
  user,
  newApprovalStatus,
  refusalReason,
}) {
  const [moderator, screenshot] = await Promise.all([
    db.User.findByPk(user.id),
    db.Screenshot.findByPk(screenshotId),
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

  const shouldIncrement = newApprovalStatus === 'approved';
  const shouldDecrement =
    (newApprovalStatus === 'refused' || newApprovalStatus === 'waiting') &&
    screenshot.approvalStatus === 'approved';

  const uploaderUser = await db.User.findByPk(screenshot.UserId);
  await Promise.all([
    screenshot.update({
      refusalReason,
      approvalStatus: newApprovalStatus,
      moderatedBy: moderator.id,
      moderatedAt: new Date(),
    }),
    shouldIncrement && uploaderUser.increment('addedScreenshots'),
    shouldDecrement && uploaderUser.decrement('addedScreenshots'),
    newApprovalStatus === 'refused' &&
      screenshotManager.removeSolvedPointsForScreenshot({ screenshotId }),
  ]);
}

async function getModerators() {
  return db.User.findAll({
    where: {
      canModerateScreenshots: 1,
    },
  });
}

async function getLastModerated() {
  return db.Screenshot.findOne({
    where: { approvalStatus: 'approved' },
    order: [['moderatedAt', 'DESC']],
  });
}
