const bluebird = require('bluebird');
const router = require('express').Router();
const moderationController = require('../controllers/moderationController');

router.use(checkModerator);

router.post('/non-moderated', (req, res, next) =>
  next(moderationController.getNonModeratedScreenshots(req))
);

router.post('/approved', (req, res, next) =>
  next(moderationController.getApprovedScreenshots(req))
);

router.post('/rejected', (req, res, next) =>
  next(moderationController.getRejectedScreenshots(req))
);

router.post('/moderated-by-you', (req, res, next) =>
  next(moderationController.getModeratedByYouScreenshots(req))
);

router.post('/moderate', (req, res, next) =>
  next(moderationController.moderateScreenshot(req))
);

module.exports = router;

function checkModerator(req, res, next) {
  const { user } = req;
  if (!user) {
    return next(
      bluebird.reject({
        status: 401,
        code: 'MUST_BE_IDENTIFIED',
        message: "User must be identified to proove that he/she's a moderator.",
      })
    );
  }
  if (!user.canModerateScreenshots) {
    return next(
      bluebird.reject({
        status: 403,
        code: 'CANNOT_MODERATE_SCREENSHOTS',
        message: 'User has no right to moderate screenshots.',
      })
    );
  }
  return next();
}
