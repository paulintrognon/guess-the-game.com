const bluebird = require('bluebird');
const logger = require('../../logger');
const db = require('../../db/db');
const { frontUrl } = require('../../../config/index');
const emailService = require('../../api/services/emailService');
const tokenService = require('../../api/services/tokenService');
const cloudinaryService = require('../../api/services/cloudinaryService');
const moderationManager = require('../../api/managers/moderationManager');
const screenshotService = require('../../api/services/screenshotService');

module.exports = emailNewScreenshotsUpdate;

async function emailNewScreenshotsUpdate(frequency) {
  // Last screenshot
  const lastScreenshotModerated = await moderationManager.getLastModerated();
  if (!lastScreenshotModerated) {
    return;
  }

  // Get users
  const users = await db.User.findAll({
    where: {
      email: { [db.Sequelize.Op.ne]: null },
      emailUpdates: frequency,
      emailUpdateLastScreenshotDate: {
        [db.Sequelize.Op.or]: [
          null,
          { [db.Sequelize.Op.lt]: lastScreenshotModerated.moderatedAt },
        ],
      },
    },
  });

  logger.info(
    `${frequency.toUpperCase()} EMAIL UPDATE - ${
      users.length
    } utilisateur(s) à mettre à jour.`
  );

  await bluebird.map(
    users,
    async user => {
      // Envoi de l'email
      await sendEmailUpdateToUser(user);
      // On met à jour le dernier screenshot d'update email
      await user.update({
        emailUpdateLastScreenshotDate: lastScreenshotModerated.moderatedAt,
      });
    },
    { concurrency: 10 }
  );
}

async function sendEmailUpdateToUser(user) {
  // On récupère les screenshots que le user n'a pas encore vu
  const screenshots = await db.sequelize.query(
    `
    SELECT
      Screenshot.id,
      ScreenshotImages.path
    FROM
      Screenshots AS Screenshot
    LEFT JOIN
      ScreenshotImages ON Screenshot.ScreenshotImageId = ScreenshotImages.id
    LEFT JOIN
      Users ON Users.id = :userId
    WHERE (
      Screenshot.deletedAt IS NULL
      AND Screenshot.approvalStatus = 'approved'
      AND (Screenshot.UserId != :userId)
      AND Screenshot.moderatedAt > Users.emailUpdateLastScreenshotDate
      AND NOT EXISTS (
        SELECT id FROM SolvedScreenshots
        WHERE
          SolvedScreenshots.ScreenshotId = Screenshot.id
          AND SolvedScreenshots.UserId = :userId
      )
      AND NOT EXISTS (
        SELECT id FROM ViewedScreenshots
        WHERE
          ViewedScreenshots.ScreenshotId = Screenshot.id
          AND ViewedScreenshots.UserId = :userId
      )
    )
    LIMIT 51
  `,
    {
      replacements: { userId: user.id },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  if (screenshots.length === 0) {
    return;
  }
  // Envoi de l'email avec les nouvelles screenshots
  const unsubToken = tokenService.createUserIdToken(user);
  await emailService.sendMarketingUpdateEmail({
    email: user.email,
    emailData: {
      user,
      screenshots: screenshots.map(screenshot => ({
        id: screenshot.id,
        siteUrl: screenshotService.getScreenshotSiteUrl(screenshot),
        imageUrl: cloudinaryService.pathToUrl(screenshot.path),
      })),
      unsubscribeLink: `${frontUrl}/email-updates/unsubscribe?token=${unsubToken}`,
      userSpaceLink: `${frontUrl}/moi/mon-compte`,
    },
  });
}
