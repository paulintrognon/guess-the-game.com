const router = require('express').Router();
const moderationController = require('../controllers/moderationController');

router.post('/non-moderated', (req, res, next) =>
  next(moderationController.getNonModeratedScreenshots(req))
);

router.post('/moderate', (req, res, next) =>
  next(moderationController.moderateScreenshot(req))
);

module.exports = router;
