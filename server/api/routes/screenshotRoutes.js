const router = require('express').Router();
const screenshotController = require('../controllers/screenshotController');

router.post('/upload-image', (req, res, next) =>
  next(screenshotController.uploadScreenshot(req))
);

router.post('/add', (req, res, next) =>
  next(screenshotController.addScreenshot(req))
);

router.post('/unsolved', (req, res, next) =>
  next(screenshotController.getUnsolvedScreenshot(req))
);

router.post('/get', (req, res, next) =>
  next(screenshotController.getfromId(req))
);

module.exports = router;
