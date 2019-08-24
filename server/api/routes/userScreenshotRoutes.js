const express = require('express');
const routeCache = require('route-cache');
const userScreenshotController = require('../controllers/userScreenshotController');

const router = express.Router();

const SCORE_CACHE_DURATION = 10; // 10 seconds
router.get(
  '/scores',
  routeCache.cacheSeconds(SCORE_CACHE_DURATION),
  (req, res, next) => next(userScreenshotController.getScores(req))
);

router.post('/solved-screenshots', (req, res, next) =>
  next(userScreenshotController.getSolvedScreenshots(req))
);

router.post('/added-screenshots', (req, res, next) =>
  next(userScreenshotController.getAddedScreenshots(req))
);

module.exports = router;
