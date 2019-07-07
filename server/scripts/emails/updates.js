const bluebird = require('bluebird');
const logger = require('../../logger');
const db = require('../../db/db');
const { frontUrl } = require('../../../config/index');
const emailService = require('../../api/services/emailService');
const tokenService = require('../../api/services/tokenService');
const screenshotManager = require('../../api/managers/screenshotManager');
const screenshotService = require('../../api/services/screenshotService');

const args = process.argv.slice(2);
const frequency = args[0];

(async () => {
  // Last screenshot
  const lastScreenshotId = await screenshotManager.getLastAdded();
  if (!lastScreenshotId) {
    process.exit();
  }

  // Get users
  const users = await db.User.findAll({
    where: {
      emailUpdates: frequency,
      emailUpdateLastScreenshotId: {
        [db.Sequelize.Op.or]: [
          null,
          { [db.Sequelize.Op.not]: lastScreenshotId },
        ],
      },
    },
  });

  logger.info(`EMAIL UPDATE - ${users.length} utilisateur(s) à mettre à jour.`);

  await bluebird.map(users, async user => {
    // On récupère les screenshots que le user n'a pas encore vu
    const screenshots = await db.Screenshot.findAll({
      where: {
        id: { [db.Sequelize.Op.gt]: user.emailUpdateLastScreenshotId },
        UserId: { [db.Sequelize.Op.not]: user.id },
        approvalStatus: 1,
      },
      limit: 30,
    });
    if (screenshots.length === 0) {
      return;
    }
    // Token de desinscription
    const unsubToken = tokenService.createUserIdToken(user);
    await emailService.sendMarketingUpdateEmail({
      email: user.email,
      emailData: {
        user,
        screenshots: screenshots.map(screenshot => ({
          id: screenshot.id,
          siteUrl: screenshotService.getScreenshotSiteUrl(screenshot),
          imageUrl: screenshotService.getScreenshotImageUrl(screenshot),
        })),
        unsubscribeLink: `${frontUrl}/email-updates/unsubscribe?token=${unsubToken}`,
        userSpaceLink: `${frontUrl}/moi/mon-compte`,
      },
    });
  });

  process.exit();
})();
