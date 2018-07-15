const router = require('express').Router();
const screenshotController = require('../controllers/screenshotController');

router.post('/upload-image', (req, res, next) =>
  next(screenshotController.uploadScreenshot(req))
);

router.post('/add-screenshot', (req, res, next) =>
  next(screenshotController.addScreenshot(req))
);

module.exports = router;
