const express = require('express');
const routeCache = require('route-cache');
const userController = require('../controllers/userController');

const router = express.Router();

const SCORE_CACHE_DURATION = 60 * 10; // One minue
router.get(
  '/scores',
  routeCache.cacheSeconds(SCORE_CACHE_DURATION),
  (req, res, next) => next(userController.getScores(req))
);

module.exports = router;
