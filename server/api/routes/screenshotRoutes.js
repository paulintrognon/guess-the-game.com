const router = require('express').Router();
const screenshotController = require('../controllers/screenshotController');

router.post('/upload-image', (req, res, next) =>
  next(screenshotController.uploadScreenshot(req))
);

router.post('/add-screenshot', (req, res, next) =>
  next(screenshotController.addScreenshot(req))
);

router.post('/random', (req, res, next) =>
  next(screenshotController.getUnsolvedScreenshot(req))
);

module.exports = router;
