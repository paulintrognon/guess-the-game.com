const express = require('express');
const routeCache = require('route-cache');
const userController = require('../controllers/userController');

const router = express.Router();

const SCORE_CACHE_DURATION = 60 * 10; // One minute
router.get(
  '/scores',
  routeCache.cacheSeconds(SCORE_CACHE_DURATION),
  (req, res, next) => next(userController.getScores(req))
);

router.post('/get', (req, res, next) => next(userController.getUser(req)));

router.post('/screenshots-found', (req, res, next) =>
  next(userController.getScreenshotsFound(req))
);

router.post('/screenshots-added', (req, res, next) =>
  next(userController.getScreenshotsAdded(req))
);

module.exports = router;
