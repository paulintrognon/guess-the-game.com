const router = require('express').Router();
const screenshotController = require('../controllers/screenshotController');

router.post('/upload-image', (req, res, next) =>
  next(screenshotController.uploadScreenshot(req))
);

module.exports = router;
